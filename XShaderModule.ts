/**
 * Created by TOM on 06/03/2017.
 */

///<reference path="XVertex.ts" />
///<reference path="XFragment.ts" />

class XShaderModule {

    private static moduleId:number = 0;

    public vertex:XVertex;
    public fragment:XFragment;
    public structByName:XStruct[];
    public structNames:string[];

    public name:string;
    public enabled:boolean = true;

    protected uniforms:any;
    protected attributes:any;



    protected modules:XShaderModule[];


    constructor(name:string=null){

        //the name of the module is used in order to debug override
        if(name) this.name = name;
        else this.name = "module_"+XShaderModule.moduleId;
        XShaderModule.moduleId++;


        this.vertex = new XVertex();
        this.fragment = new XFragment();

        this.modules = [];
        this.structNames = [];
        this.structByName = [];
    }


    public update():void{
        //must be overrided
    }


    public setVarying(name:string,dataType:number|THREE.Vector2):void{
        /*
        there is 3 ways to use "dataType" :
        - either you put 1,2,3,4,5,6 in order to create a float,vec2,vec3,vec4, mat3, mat4
        - either you use the static constants
           XElement.FLOAT , XElement.VEC2 , XElement.VEC4 , XElement.VEC4
           XElement.MAT3 , XElement.MAT4

        - either, if you want to set an array as varying, you can pass a THREE.Vector2 written like that

        THREE.Vector2( C , arrayLength );

        where C equals a XElement constant, for example THREE.Vector2(XElement.VEC2,3);

        */
        this.vertex.varyings.push(new XElement("varying",name,dataType,this.name));
    }

    public setVertexBuffer(buffer:XBuffer):XBuffer{
        this.vertex.attributes.push(buffer);
        buffer.moduleName = this.name;
        return buffer;
    }
    public setVertexAttribute(name:string,nbComponent:number,datas:number[]|Float32Array = null):XBuffer{
        return this.vertex.setAttribute(name,nbComponent,datas,this.name);
    }

    public setVertexUniform(name:string,value:number|
        THREE.Vector2|
        THREE.Vector3|
        THREE.Vector4|
        THREE.Texture|
        number[]|
        THREE.Vector2[]|
        THREE.Vector3[]|
        THREE.Vector4[]|
        THREE.Texture[]|
        THREE.Color|
        THREE.Color[]|
        THREE.Matrix4|
        THREE.Matrix4[]|
        THREE.Matrix3|
        THREE.Matrix3[]|
        THREE.CubeTexture|
        THREE.CubeTexture[]):XElement{
        var e:XElement = new XElement("uniform",name,value,this.name);
        this.vertex.uniforms.push(e)
        return e;
    }

    public setFragmentUniform(name:string,value:number|
        THREE.Vector2|
        THREE.Vector3|
        THREE.Vector4|
        THREE.Texture|
        number[]|
        THREE.Vector2[]|
        THREE.Vector3[]|
        THREE.Vector4[]|
        THREE.Texture[]|
        THREE.Color|
        THREE.Color[]|
        THREE.Matrix4|
        THREE.Matrix4[]|
        THREE.Matrix3|
        THREE.Matrix3[]|
        THREE.CubeTexture|
        THREE.CubeTexture[]):XElement{
        var e:XElement = new XElement("uniform",name,value,this.name);

        this.fragment.uniforms.push(e)
        return e;
    }


    public setVertexConstant(name:string,value:number|
        THREE.Vector2|
        THREE.Vector3|
        THREE.Vector4|
        THREE.Texture|
        number[]|
        THREE.Vector2[]|
        THREE.Vector3[]|
        THREE.Vector4[]|
        THREE.Texture[]|
        THREE.Color|
        THREE.Color[]|
        THREE.Matrix4|
        THREE.Matrix4[]|
        THREE.Matrix3|
        THREE.Matrix3[]|
        THREE.CubeTexture|
        THREE.CubeTexture[]):XElement{
        var e:XElement = new XElement("const",name,value,this.name);
        this.vertex.constants.push(e)
        return e;
    }

    public setFragmentConstant(name:string,value:number|
        THREE.Vector2|
        THREE.Vector3|
        THREE.Vector4|
        THREE.Texture|
        number[]|
        THREE.Vector2[]|
        THREE.Vector3[]|
        THREE.Vector4[]|
        THREE.Texture[]|
        THREE.Color|
        THREE.Color[]|
        THREE.Matrix4|
        THREE.Matrix4[]|
        THREE.Matrix3|
        THREE.Matrix3[]|
        THREE.CubeTexture|
        THREE.CubeTexture[]):XElement{
        var e:XElement = new XElement("const",name,value,this.name);
        this.fragment.constants.push(e)
        return e;
    }



    public setModule(module:XShaderModule):XShaderModule{
        //console.log("setModule "+this.modules.lastIndexOf(module));

        if(this.modules.lastIndexOf(module) == -1){
            //console.log("pushModule");
            this.modules.push(module);
        }
        return module;
    }

    public setStructure(name:string,structure:any[]):void{
        //console.info("The structure '"+name+"' already exist and will be replaced by the new one.")

        if(this.structNames.lastIndexOf(name) == -1) this.structNames.push(name);
        this.structByName[name] = new XStruct(name,structure,this.name);
    }


    //==========================

    public compile():any{

        var i:number,len:number = this.modules.length;
        for(i=0;i<len;i++){
            this.modules[i].vertex.disableVaryings = true;
            this.modules[i].compile();
        }


        var structInfos:any = this.blendStructures();
        this.attributes = this.blendAttributes();
        this.uniforms = this.blendUniforms();
        this.blendVaryings();
        this.blendCode();

        var vs:string = this.vertex.glsl;
        var fs:string = this.fragment.glsl;

        vs = XStruct.findStructInstancesAndGetDefinition(vs,structInfos.structNames,structInfos.structByName) + vs;
        fs = XStruct.findStructInstancesAndGetDefinition(fs,structInfos.structNames,structInfos.structByName) + fs;

        console.log(vs);
        console.log("-------------------")
        console.log(fs);

        return {
            vertexShader:vs,
            fragmentShader:fs,
            uniforms:this.uniforms,
        };

    }

    protected blendCode():void{
        var i:number,len:number = this.modules.length;

        for(i=len-1;i>-1;i--){

            this.vertex.getPosition.addCodeBefore(this.modules[i].vertex.getPosition.glsl);
            this.vertex.modifyPosition.addCodeBefore(this.modules[i].vertex.modifyPosition.glsl);
            this.vertex.applyPosition.addCodeBefore(this.modules[i].vertex.applyPosition.glsl);

            this.fragment.getColor.addCodeBefore(this.modules[i].fragment.getColor.glsl);
            this.fragment.modifyColor.addCodeBefore(this.modules[i].fragment.modifyColor.glsl);
            this.fragment.applyColor.addCodeBefore(this.modules[i].fragment.applyColor.glsl);

            //this.vertex.mainInit.addCodeBefore(this.modules[i].vertex.mainInit.glsl);
            //this.vertex.main.addCodeAfter(this.modules[i].vertex.main.glsl);

            //this.fragment.mainInit.addCodeBefore(this.modules[i].fragment.mainInit.glsl);
            //this.fragment.main.addCodeAfter(this.modules[i].fragment.main.glsl);
        }
    }


    protected blendStructures():any{
        var result:any = {};
        var structNames:string[] = [];
        var structByName:XStruct[] = [];

        this.modules.unshift(this);
        var i:number,len:number = this.modules.length;
        var j:number,nb:number,names:string[],structs:XStruct[],name:string;
        for(i=0;i<len;i++){
            if(this.modules[i].enabled == false) continue;
            names = this.modules[i].structNames;
            structs = this.modules[i].structByName;
            nb = names.length;
            for(j=0;j<nb;j++){
                name = names[j];
                if(structNames.lastIndexOf(name)==-1){
                    structNames.push(name);
                    structByName[name] = structs[name];
                }else{
                    console.warn("The structure '"+name+"' is already defined in the module '"+structByName[name].moduleName+"' . It will be replaced by the one located in the module '"+structs[name].moduleName+"'.");
                    structByName[name] = structs[name];
                }
            }
        }

        this.modules.shift()
        result.structNames = structNames;
        result.structByName = structByName;
        return result;

    }




    protected blendVaryings():any{
        var o:any = {}
        //this.modules.push(this);
        var i:number,len:number;
        var j:number,nb:number;
        var module:XShaderModule;
        var t:XElement[],e:XElement;
        var names:string[];
        var values:string[];

        t = this.uniforms.__elements;
        len = t.length;
        for(i=0;i<len;i++) if(t[i].isVarying) this.vertex.setVarying(t[i].name,t[i].nbCompo,t[i].moduleName);

        t = this.attributes.__elements;

        len = t.length;
        for(i=0;i<len;i++){
           console.log("attributes : "+t[i].name,t[i].isVarying , t[i].nbCompo)
           if(t[i].isVarying) this.vertex.setVarying(t[i].name,t[i].nbCompo,t[i].moduleName);
        }


        len = this.modules.length;
        for(i=0;i<len;i++){
            if(this.modules[i].enabled == false) continue;
            module = this.modules[i];
            t = module.vertex.varyings;
            nb = t.length;
            names = [];
            values = [];
            for(j=0;j<nb;j++){
                e = t[j];
                if(e.enabled){
                    console.log("add varying -> "+e.realName);
                    if(!o[e.realName]) {
                        o[e.realName] = e;
                    }else{
                        var name:string = e.realName;
                        //while(o[e.realName]) e.getOtherName();
                        names.push(name);
                        values.push(e.realName);
                    }
                }
            }

            module.vertex.main.modify(names,values);
            module.fragment.main.modify(names,values);

        }

        //this.modules.pop();


        this.fragment.setVaryingFromVertex(this.vertex.varyings);

        return o;
    }




    protected blendAttributes():any{
        var o:any = {};

        this.modules.push(this);
        var i:number,len:number = this.modules.length;
        console.log("nbModule = "+len);
        var j:number,nb:number;
        var module:XShaderModule;
        var t:XBuffer[],e:XBuffer;
        var elements:XBuffer[] = [];
        for(i=0;i<len;i++){
            module = this.modules[i];
            if(this.modules[i].enabled == false) continue;
            t = module.vertex.attributes;
            nb = t.length;
            for(j=0;j<nb;j++){
                e = t[j];
                if(e.enabled){
                    if(!o[e.realName]){

                        o[e.realName] = e;
                        elements.push(e);
                    }
                    else{
                        if(e.array){
                            o[e.realName].create(e.array);
                            o[e.realName] = e;
                        }else{
                            e.create(o[e.realName].array);
                        }
                    }
                }
            }
        }
        this.modules.pop();

        o.__elements = elements;

        var i:number,len:number = elements.length;
        for(i=0;i<len;i++){
            //////////console.log(elements[i].moduleName+" != "+this.name);
            if(elements[i].moduleName != this.name){
                this.setVertexBuffer(elements[i]);
            }
        }

        return o;
    }



    protected blendUniforms():any{

        this.modules.push(this);

        var vElements:XElement[] = [];
        var fElements:XElement[] = [];

        var result:any = {};
        var t:XElement[] = this.vertex.uniforms;
        var i:number,len:number = t.length;
        var e:XElement;
        var names:string[] = [];
        var values:string[] = [];


        var j:number,nb:number = this.modules.length;
        var module:XShaderModule;
        for(j=0;j<nb;j++) {
            if(this.modules[j].enabled == false) continue;
            module = this.modules[j];
            t = module.vertex.uniforms;
            len = t.length;
            for (i = 0; i < len; i++) {
                e = t[i];

                if (e.enabled) {
                    if(!result[e.realName]){
                        result[e.realName] = e;
                        vElements.push(e);
                        //////////console.log(this.name+" => "+e.realName)
                    }else if (e.override) result[e.realName] = e;
                    else {
                        while (result[e.realName] != undefined) e.getOtherName();
                        result[e.realName] = e;
                        vElements.push(e);

                    }
                }
            }

            t = module.fragment.uniforms;
            len = t.length;
            for (i = 0; i < len; i++) {
                e = t[i];
                console.log("uniform name = "+e.name);
                if (e.enabled) {
                    if(!result[e.realName]){
                        result[e.realName] = e;
                        fElements.push(e);
                    }else if (e.override) result[e.realName] = e;
                    else {
                        while (result[e.realName] != undefined) e.getOtherName();
                        result[e.realName] = e;
                        fElements.push(e);
                    }
                }
            }


            t = module.vertex.constants;
            len = t.length;
            var name: string;
            names = [];
            values = [];
            for (i = 0; i < len; i++) {
                e = t[i];
                name = e.realName;
                while (result[name] != undefined) e.getOtherName();
                names.push(name);
                values.push(e.realName);
            }
            module.vertex.main.modify(names,values);


            t = module.fragment.constants;
            len = t.length;
            names = [];
            values = [];
            for (i = 0; i < len; i++) {
                e = t[i];
                name = e.realName;
                while (result[name] != undefined) e.getOtherName();
                names.push(name);
                values.push(e.realName);
            }
            module.fragment.main.modify(names,values);



        }

        this.modules.pop();

        result.__elements = vElements;

        var i:number,len:number = vElements.length;
        for(i=0;i<len;i++){
            if(vElements[i].moduleName != this.name){
                this.setVertexUniform(vElements[i].name,vElements[i].value);
            }
        }
        len = fElements.length;
        for(i=0;i<len;i++){
            if(fElements[i].moduleName != this.name){
                this.setFragmentUniform(fElements[i].name,fElements[i].value);
            }
        }

        return result;

    }


}