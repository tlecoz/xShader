/**
 * Created by TOM on 13/05/2017.
 */

///<reference path="../XShader.ts"/>
///<reference path="../XShaderModule.ts"/>
class TextureQuadModule extends XShaderModule {
    constructor(nbQuad:number,resultColorName:string="col",textureName:string="texture",uvName:string="uvts",texture:THREE.Texture=XShader.DEFAULT_TEXTURE){
        super();
        this.setFragmentUniform(textureName,texture);
        this.setVertexBuffer(XBuffer.createQuadUV_Buffer(uvName,nbQuad)).isVarying = true;
        this.fragment.getColor.define(`vec4 `+resultColorName+` = texture2D(`+textureName+`,`+uvName+`);`)
    }
}