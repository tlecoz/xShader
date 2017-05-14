

class XStruct {

    private static structNames:string[] = [];
    private static structByName:XStruct[] = [];


    public name:string;
    public structure:any[];
    public moduleName:string; //use to locate override datas;

    protected instanceNames:string[];


    constructor(name:string,structure:any[],moduleName:string){
        this.name = name;
        this.instanceNames = [];
        this.structure = structure;
        this.moduleName = moduleName;


    }

    public createStructInstance(instanceName:string):void{
        if(this.instanceNames.lastIndexOf(instanceName) == -1) this.instanceNames.push(instanceName);
    }

    public get glsl():string{
        if(this.instanceNames.length == 0) return "";

        var result:string = "struct "+this.name+"{\n";
        var i:number,len:number = this.structure.length;
        for(i=0;i<len;i++) result += this.structure[i].type+" "+this.structure[i].name+";\n"
        result += "}";
        len = this.instanceNames.length;
        for(i=0;i<len;i++){
            if(i>0) result += ","
            result += this.instanceNames[i];
        }
        result += ";\n"
        return result
    }



    public static findStructInstancesAndGetDefinition(wholeShaderCode:string,structNames:string[],structByName:XStruct[]):string{
        var result:string = "";

        var i:number,len:number = structNames.length;
        var j:number,len2:number
        var used:string[] = [];
        var n:string;
        for(i=0;i<len;i++){
            n = structNames[i];
            var t:string[] = wholeShaderCode.split(n);
            if(t.length == 1) continue;

            len2 = t.length;
            var t2:string[];
            var c:string;
            for(j=len2-2;j>-1;j--){
                c = t[j].split("\n").pop();

                t2 = c.split("=");
                if(t2.length==2){
                    c = t2[0].split(" ").join("");
                    structByName[n].createStructInstance(c);
                    if(used.lastIndexOf(n) == -1) used.push(n);
                }
            }
        }

        len = used.length;
        for(i=0;i<len;i++){
            result += structByName[used[i]].glsl;
        }
        return result;
    }

}



/*

class XStruct {

    private static structs:XStruct[] = [];

    


    private instanceNames:string[] = [];
    private name:string;
    private definition:string;

    constructor(name:string,definition:string){
        this.name = name;
        this.definition = definition;
    }

    public static checkForStructDefinition(glslShader:string):void{
        var result:string = glslShader;
        var oldResult:string = null
        while(result != oldResult){
            oldResult = result;
            result = XStruct.createNewStruct(glslShader);
        }
    }
    private static createNewStruct(glslShader:string):string{
        var result = glslShader;


        //Particle = Struct({
        //    x:float,
        //    y:float;
        //    width:float;
        //    height:float;
        //})
        //Particle p = Particle({ x:position.x, y:position.y,width:quadSize.x,height:quadSize.y});




        var t:string[] = result.split("Struct({");

        if(t.length){

            var tt:string[] = t[0].split("\n");
            tt.pop();
            var begin:string = tt.join("\n");
            var end:string;

            var structName:string = t[0].split("\n").pop().split("=")[0];
            if(XStruct.structs[structName]) return;

            tt = t[1].split("})");
            var content:string = tt[0];
            tt.shift();
            end = tt.join("})");

            var t:string[] = content.split(",");
            var t2:string[];
            var res:string = "";
            var i:number,len:number = t.length;
            for(i=0;i<len;i++){
                t2 = t[i].split(":");
                res += t2[1]+" "+t2[0]+",\n"
            }

            var definition:string = "struct "+structName+" {\n" + res + "}\n";

            XStruct.structs[structName] = new XStruct(structName,definition);

           result = begin+"\n"+end;

        }

        return result;
    }


    public static clear():void{
        XStruct.structs = [];
    }
    public addInstance(instanceName:string):void{
        if(this.instanceNames.lastIndexOf(instanceName) != -1){
            throw new Error("The name '+instanceName+' of the XStruc '"+this.name+"' already exists");
        }
        this.instanceNames.push(instanceName);

    }
}
*/