var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="XBaseShader.ts"/>
var XFragment = (function (_super) {
    __extends(XFragment, _super);
    function XFragment() {
        _super.call(this);
        this.getColor = this.codeInit; //this.main.createSubShaderCode(``);
        this.modifyColor = this.main.createSubShaderCode("");
        this.applyColor = this.main.createSubShaderCode("");
    }
    return XFragment;
}(XBaseShader));
