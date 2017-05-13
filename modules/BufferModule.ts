/**
 * Created by TOM on 13/05/2017.
 */
///<reference path="../XShaderModule.ts"/>
class BufferModule extends XShaderModule {

    constructor(nbQuad:number,quadColorName:string){
        super();
        this.setVertexBuffer(XBuffer.createQuadRGB_Buffer(quadColorName,nbQuad,true)).isVarying = true;

        var code:XShaderCode = this.fragment.applyColor.createSubShaderCode("gl_FragColor.xy += $quadColor.xy;");
        code.replaceVariables([{name:"$quadColor",value:quadColorName}]);
    }
}


