var XStruct = (function () {
    function XStruct(name, structure, moduleName) {
        this.name = name;
        this.instanceNames = [];
        this.structure = structure;
        this.moduleName = moduleName;
    }
    XStruct.prototype.createStructInstance = function (instanceName) {
        if (this.instanceNames.lastIndexOf(instanceName) == -1)
            this.instanceNames.push(instanceName);
    };
    Object.defineProperty(XStruct.prototype, "glsl", {
        get: function () {
            if (this.instanceNames.length == 0)
                return "";
            var result = "struct " + this.name + "{\n";
            var i, len = this.structure.length;
            for (i = 0; i < len; i++)
                result += this.structure[i].type + " " + this.structure[i].name + ";\n";
            result += "}";
            len = this.instanceNames.length;
            for (i = 0; i < len; i++) {
                if (i > 0)
                    result += ",";
                result += this.instanceNames[i];
            }
            result += ";\n";
            return result;
        },
        enumerable: true,
        configurable: true
    });
    XStruct.findStructInstancesAndGetDefinition = function (wholeShaderCode, structNames, structByName) {
        var result = "";
        var i, len = structNames.length;
        var j, len2;
        var used = [];
        var n;
        for (i = 0; i < len; i++) {
            n = structNames[i];
            var t = wholeShaderCode.split(n);
            if (t.length == 1)
                continue;
            len2 = t.length;
            var t2;
            var c;
            for (j = len2 - 2; j > -1; j--) {
                c = t[j].split("\n").pop();
                t2 = c.split("=");
                if (t2.length == 2) {
                    c = t2[0].split(" ").join("");
                    structByName[n].createStructInstance(c);
                    if (used.lastIndexOf(n) == -1)
                        used.push(n);
                }
            }
        }
        len = used.length;
        for (i = 0; i < len; i++) {
            result += structByName[used[i]].glsl;
        }
        return result;
    };
    XStruct.structNames = [];
    XStruct.structByName = [];
    return XStruct;
}());
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
