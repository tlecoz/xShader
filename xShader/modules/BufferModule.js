var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TOM on 13/05/2017.
 */
///<reference path="../XShaderModule.ts"/>
var BufferModule = (function (_super) {
    __extends(BufferModule, _super);
    function BufferModule(nbQuad, quadColorName) {
        _super.call(this);
        this.setVertexBuffer(XBuffer.createQuadRGB_Buffer(quadColorName, nbQuad, true)).isVarying = true;
        var code = this.fragment.applyColor.createSubShaderCode("gl_FragColor.xy += $quadColor.xy;");
        code.replaceVariables([{ name: "$quadColor", value: quadColorName }]);
    }
    return BufferModule;
}(XShaderModule));
//# sourceMappingURL=BufferModule.js.map