/**
 * Created by TOM on 04/03/2017.
 */
///<reference path="XFragment.ts"/>
class XVertex extends XBaseShader {

    public attributes:XBuffer[];
    public varyings:XElement[];

    //public setupVaryings:XShaderCode;
    public getPosition:XShaderCode;
    public modifyPosition:XShaderCode;
    public applyPosition:XShaderCode;

    constructor(){
        super();
        this.attributes = [];
        this.varyings = [];

        //this.setupVaryings = this.main.createSubShaderCode(``);
        this.getPosition = this.codeInit;//this.main.createSubShaderCode(``);
        this.modifyPosition = this.main.createSubShaderCode(``);
        this.applyPosition = this.main.createSubShaderCode(``);
    }

    public setAttribute(name:string,nbComponent,datas:number[]|Float32Array = null,moduleName:string=""):XBuffer{
        var e:XBuffer = new XBuffer(name,nbComponent,datas,moduleName);
        this.attributes.push(e);
        return e;
    }
    public setVarying(name:string,nbComponent:number,moduleName:string):XElement{
        //////////console.log("setVarying ",name,nbComponent);

        var i:number,len:number = this.varyings.length;
        for(i=0;i<len;i++) if(this.varyings[i].name == name) return null;

        var e:XElement = new XElement("varying",name,nbComponent,moduleName);
        this.varyings.push(e);
        return e;
    }

    protected getVariableDefinition():string{
        var result:string = "";

        var i:number,len:number = this.attributes.length;
        var c:string;
        for(i=0;i<len;i++){
            if(this.attributes[i].enabled){
                result += this.attributes[i].glsl;
                c = this.attributes[i].initElementName;
                if(c!="" && this.disableVaryings == false) this.codeInit.addCodeAfter(c);
            }
        }


        result += super.getVariableDefinition();

        len = this.varyings.length;
        for(i=0;i<len;i++) if(this.varyings[i].enabled) result += this.varyings[i].glsl;

        return result;
    }


}