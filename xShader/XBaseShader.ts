
///<reference path="XElement.ts"/>
///<reference path="XBuffer.ts"/>
///<reference path="XIndexBuffer.ts"/>
///<reference path="XShaderCode.ts"/>
    ///<reference path="XStruct.ts"/>
class XBaseShader {



    public uniforms:XElement[];
    public constants:XElement[];
    protected rootCode:XShaderCode;
    protected raw:XShaderCode;
    protected code:XShaderCode;
    protected codeInit:XShaderCode;
    protected mainCode:XShaderCode;

    private varyingDefinition:string="";
    public disableVaryings:boolean = false;

    constructor(){
        this.uniforms = [];
        this.constants = [];

        this.rootCode = new XShaderCode(null,"",0);
        this.raw = this.rootCode.createSubShaderCode("",0);

        this.codeInit = this.rootCode.createSubShaderCode("",1);
        this.mainCode = this.rootCode.createSubShaderCode("",2);

    }

    public define(code:string,priority:number=0):XShaderCode{
        this.mainCode.define(code,priority);
        return this.mainCode;
    }
    public createSubShaderCode(code:string,priority:number=0):XShaderCode{ return this.code.createSubShaderCode(code,priority); }


    public get rawCode():XShaderCode{return this.raw;}
    public get main():XShaderCode{return this.mainCode;}
    public get mainInit():XShaderCode{return this.codeInit;}
    public get root():XShaderCode{return this.rootCode;}




    public setVaryingFromVertex(v:XElement[]):void{

        var i:number,len:number = v.length;
        var va:string = "";
        for(i=0;i<len;i++) va += v[i].glsl;
        this.varyingDefinition = va;

    }


    protected getVariableDefinition():string{
        var result:string = this.varyingDefinition;
        if(this.disableVaryings) result = "";

        var i:number,len:number = this.uniforms.length;
        var c:string,e:XElement;
        for(i=0;i<len;i++) if(this.uniforms[i].enabled){
            e = this.uniforms[i];
            result += e.glsl;
            c = e.initElementName;
            if(c!="") this.codeInit.addCodeAfter(c);
        }

        len = this.constants.length;
        for(i=0;i<len;i++) if(this.constants[i].enabled) result += this.constants[i].glsl;

        return result;
    }

    public get glsl():string{

        var result:string = "";
        result += this.getVariableDefinition()+"\n";
        result += this.raw.glsl+"\n";
        result += "void main(void){\n";
        result += this.codeInit.glsl+"\n";
        result += this.mainCode.glsl+"\n";
        result += "}";
        return result;
    }
}