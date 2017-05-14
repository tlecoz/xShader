

class XShaderCode {


    protected parent:XShaderCode;
    protected children:XShaderCode[];
    public code:string;
    public priority:number;
    public enabled:boolean = true;
    protected savedCode:string;

    constructor(parent:XShaderCode=null,code:string,priority:number=0){
        this.parent = parent;
        this.children = [];
        this.priority = priority;
        this.code = code;
    }

    public define(code:string,priority:number=0):XShaderCode{
        this.code = code;
        this.priority = priority;
        return this;
    }
    public clearCode():void{
        this.code = "";
    }
    public addCodeBefore(code:string){
        this.code = code + this.code;
    }
    public addCodeAfter(code:string){
        this.code += code;
    }
    public save():XShaderCode{
        this.savedCode = ""+this.code;
        return this;
    }
    public restore():XShaderCode{
        this.code = ""+this.savedCode;
        return this;
    }
    public createSubShaderCode(code:string="",priority:number=0):XShaderCode{
        var result:XShaderCode = new XShaderCode(this,code,priority);
        this.children.push(result);
        return result;
    }

    public modify(words:string[],values:string[]):void{

        var i:number,len:number = words.length;
        var c:string;

        var j:number,nb:number = this.children.length;
        for(j=0;j<nb;j++) this.children[j].modify(words,values);

        for (i = 0; i < len; i++)this.code = this.code.split(words[i]).join(values[i]);

    }

    public replaceVariables(variables:any[]):XShaderCode{

        var i:number,len:number = variables.length;
        var names:string[] = [];
        var values:any[] = [];
        //////////console.log("variables = "+variables+" : "+variables.length+" : "+variables[0])
        for(i=0;i<len;i++){
            names[i] = variables[i].name;
            if(!isNaN(variables[i].value)) values[i] = this.getFloat(variables[i].value);
            else values[i] = variables[i].value;
        }
        this.modify(names,values);
        return this;
    }
    protected getFloat(n:number):string{
        var result:string = ""+n;
        if(result.split(".").length>1) return result;
        else return result+".0";
    }

    public get glsl():string{
        var result:string = this.code;
        if(this.children.length){

            this.children.sort(function(a:XShaderCode,b:XShaderCode):number{
                if(a.priority > b.priority) return 1;
                if(a.priority < b.priority) return -1;
                return 0;
            })

            var i:number,len:number = this.children.length;
            for(i=0;i<len;i++) if(this.children[i].enabled) result += this.children[i].glsl+"\n";

        }
        return result;
    }



}