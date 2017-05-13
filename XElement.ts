/**
 * Created by TOM on 03/03/2017.
 */

///<reference path="../libs/threejs/three.d.ts"/>

class XElement {

    public static FLOAT:number = 1;
    public static VEC2:number = 2;
    public static VEC3:number = 3;
    public static VEC4:number = 4;
    public static MAT3:number = 5;
    public static MAT4:number = 6;


    private static countName:number = 0;

    public moduleName:string;
    public override:boolean =false;
    public enabled:boolean = true;
    public type:string;
    public value:number|THREE.Vector2|THREE.Vector3|THREE.Vector4|THREE.Texture|number[]|THREE.Vector2[]|THREE.Vector3[]|THREE.Vector4[]|THREE.Texture[]|THREE.Color|THREE.Color[]|THREE.Matrix4|THREE.Matrix4[]|THREE.Matrix3|THREE.Matrix3[]|THREE.CubeTexture|THREE.CubeTexture[];

    protected _name:string;
    protected _realName:string;
    protected _isVarying:boolean = false;
    protected _useOtherName:boolean = false;
    protected _nbCompo:number;
    
    protected glType:string;
    protected isArray:boolean;
    protected arrayLen:number;
    protected dataType:string;


    constructor(dataType:"uniform"|"attribute"|"varying"|"const", name:string,value:number|
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
                                                                                THREE.CubeTexture[],moduleName:string ){

        this._name = this._realName = name;
        this.moduleName = moduleName;
        this.value = value;
        this.dataType = dataType;
        this.isArray = false;
        
        if((value as any).push){
            this.isArray = true;
            this.arrayLen = (value as any).length;
            value = value[0];
        }


        switch (true){
            case value instanceof THREE.CubeTexture:
                this.type = "t";
                this.glType = "samplerCube";
                break
            case value instanceof THREE.Matrix3:
                this.type = "m3";
                this.glType = "mat3";
                break
            case value instanceof THREE.Matrix4:
                this.type = "m4";
                this.glType = "mat4";
                break
            case value instanceof THREE.Color:
                this.type = "c";
                this.glType = "vec3";
                break
            case value instanceof THREE.Texture:
                this.type = "t";
                this.glType = "sampler2D"
                break;
            case value instanceof THREE.Vector2:
                this.type = "v2";
                this.glType = "vec2";
                break
            case value instanceof THREE.Vector3:
                this.type = "v3";
                this.glType = "vec3";
                break
            case value instanceof THREE.Vector4:
                this.type = "v4";
                this.glType = "vec4";
                break
            case !isNaN(value as any):
            default:
                this.type = "f";
                this.glType = "float";
                break
        }

        if(this.isArray) this.type += "v";

        if(this.dataType == "attribute" || this.dataType == "varying"){
            if(this.value == 1) this.glType = "float";
            else this.glType = "vec"+this.value;
        }else if(this.dataType == "varying"){
            var len:number = 0;
            var type:number = 0;
            var gltype:string = "";
            if(this.value instanceof THREE.Vector2){ //if it represent an array of variable
                type = this.value.x;
                this.isArray = true;
                this.arrayLen = this.value.y;
            }else{
                type = this.value as number;
            }

            switch(type){
                case 1:
                    gltype = "float";
                    break;
                case 2:
                    gltype = "vec2";
                    break;
                case 3:
                    gltype = "vec3";
                    break;
                case 4:
                    gltype = "vec4";
                    break;
                case 5:
                    gltype = "mat3";
                    break;
                case 6:
                    gltype = "mat4";
                    break;

            }

        }


    }
    public get name():string{ return this._name;}
    public get realName():string{ return this._realName};

    public get initElementName():string{
        //console.log("initElementName = "+this._name);
        if(this._isVarying )return this._name+" = "+this._realName+";\n";
        if(this._useOtherName) return this.glType+" "+this._name+" = "+this._realName+";\n";
        return "";
    }

    public getOtherName():void{

        //console.info("the _name '"+this.realName+"' is already used ; it will be replaced by '"+this._realName+"_"+(XElement.countName)+"'");
        this._realName = this._realName+"_"+(XElement.countName++)+"_";
    }
    public get nbCompo():number{return this._nbCompo;}
    public get isVarying():boolean{ return this._isVarying;}
    public set isVarying(b:boolean){
        if(b) this._realName = this._name+"_V";
        else this._realName = this._name;
        this._isVarying = b;

        switch (this.glType){
            case "float":
                this._nbCompo = 1;
                break;
            case "vec2":
                this._nbCompo = 2;
                break;
            case "vec3":
                this._nbCompo = 3;
                break;
            case "vec4":
                this._nbCompo = 4;
                break;
            case "mat3":
                this._nbCompo = 5;
                break;
            case "mat4":
                this._nbCompo = 6;
                break;
        }

    }

    public get glsl():string{
        var arrayInfo:string = "";
        if(this.isArray) arrayInfo = "["+this.arrayLen+"]";

        switch (this.dataType){
            case "attribute":
            case "uniform":
            case "varying":
                return this.dataType+" "+this.glType+" "+this._realName+arrayInfo+";\n";
            case "const":
                return this.dataType+" "+this.glType+" "+this._realName+" "+this.getGlConstantValue(this.value)+"\n";
        }
    }

    private getGlConstantValue(v:any):string{
        var result:string;
        
        if(v.push){
            var i:number,len:number = v.length;
            result +=";\n";
            for(i=0;i<len;i++){
                result += this._realName+"["+i+"] "+this.getGlConstantValue(v[i])+"\n";
            }
            return result;
        }
            
        result = "= ";
        
        switch (this.type){
            case "f":
                return result+""+v+";";
            case "v2":
                return result+"vec2("+v.x+","+v.y+");" ;
            case "v3":
            case "c":    
                return result+"vec3("+v.x+","+v.y+","+v.z+");" ;
            case "v4":
                return result+"vec4("+v.x+","+v.y+","+v.z+","+v.w+");" ;
        }
    }

}