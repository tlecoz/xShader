/**
 * Created by TOM on 13/05/2017.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../XShader.ts"/>
///<reference path="../XShaderModule.ts"/>
var TextureQuadModule = (function (_super) {
    __extends(TextureQuadModule, _super);
    function TextureQuadModule(nbQuad, resultColorName, textureName, uvName, texture) {
        if (resultColorName === void 0) { resultColorName = "col"; }
        if (textureName === void 0) { textureName = "texture"; }
        if (uvName === void 0) { uvName = "uvts"; }
        if (texture === void 0) { texture = XShader.DEFAULT_TEXTURE; }
        _super.call(this);
        this.setFragmentUniform(textureName, texture);
        this.setVertexBuffer(XBuffer.createQuadUV_Buffer(uvName, nbQuad)).isVarying = true;
        this.fragment.getColor.define("vec4 " + resultColorName + " = texture2D(" + textureName + "," + uvName + ");");
    }
    return TextureQuadModule;
}(XShaderModule));
//# sourceMappingURL=TextureQuadModule.js.map