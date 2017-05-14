var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Thomas Le Coz on 04/03/2017.
 * email:fanthomas.lecoz (at) gmail (dot) com
 */
///<reference path="XFragment.ts"/>
var XVertex = (function (_super) {
    __extends(XVertex, _super);
    function XVertex() {
        _super.call(this);
        this.attributes = [];
        this.varyings = [];
        //this.setupVaryings = this.main.createSubShaderCode(``);
        this.getPosition = this.codeInit; //this.main.createSubShaderCode(``);
        this.modifyPosition = this.main.createSubShaderCode("");
        this.applyPosition = this.main.createSubShaderCode("");
    }
    XVertex.prototype.setAttribute = function (name, nbComponent, datas, moduleName) {
        if (datas === void 0) { datas = null; }
        if (moduleName === void 0) { moduleName = ""; }
        var e = new XBuffer(name, nbComponent, datas, moduleName);
        this.attributes.push(e);
        return e;
    };
    XVertex.prototype.setVarying = function (name, nbComponent, moduleName) {
        //////////console.log("setVarying ",name,nbComponent);
        var i, len = this.varyings.length;
        for (i = 0; i < len; i++)
            if (this.varyings[i].name == name)
                return null;
        var e = new XElement("varying", name, nbComponent, moduleName);
        this.varyings.push(e);
        return e;
    };
    XVertex.prototype.getVariableDefinition = function () {
        var result = "";
        var i, len = this.attributes.length;
        var c;
        for (i = 0; i < len; i++) {
            if (this.attributes[i].enabled) {
                result += this.attributes[i].glsl;
                c = this.attributes[i].initElementName;
                if (c != "" && this.disableVaryings == false)
                    this.codeInit.addCodeAfter(c);
            }
        }
        result += _super.prototype.getVariableDefinition.call(this);
        len = this.varyings.length;
        for (i = 0; i < len; i++)
            if (this.varyings[i].enabled)
                result += this.varyings[i].glsl;
        return result;
    };
    return XVertex;
}(XBaseShader));
