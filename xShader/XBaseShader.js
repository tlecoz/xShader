///<reference path="XElement.ts"/>
///<reference path="XBuffer.ts"/>
///<reference path="XIndexBuffer.ts"/>
///<reference path="XShaderCode.ts"/>
///<reference path="XStruct.ts"/>
var XBaseShader = (function () {
    function XBaseShader() {
        this.varyingDefinition = "";
        this.disableVaryings = false;
        this.uniforms = [];
        this.constants = [];
        this.rootCode = new XShaderCode(null, "", 0);
        this.raw = this.rootCode.createSubShaderCode("", 0);
        this.codeInit = this.rootCode.createSubShaderCode("", 1);
        this.mainCode = this.rootCode.createSubShaderCode("", 2);
    }
    XBaseShader.prototype.define = function (code, priority) {
        if (priority === void 0) { priority = 0; }
        this.mainCode.define(code, priority);
        return this.mainCode;
    };
    XBaseShader.prototype.createSubShaderCode = function (code, priority) {
        if (priority === void 0) { priority = 0; }
        return this.code.createSubShaderCode(code, priority);
    };
    Object.defineProperty(XBaseShader.prototype, "rawCode", {
        get: function () { return this.raw; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XBaseShader.prototype, "main", {
        get: function () { return this.mainCode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XBaseShader.prototype, "mainInit", {
        get: function () { return this.codeInit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XBaseShader.prototype, "root", {
        get: function () { return this.rootCode; },
        enumerable: true,
        configurable: true
    });
    XBaseShader.prototype.setVaryingFromVertex = function (v) {
        var i, len = v.length;
        var va = "";
        for (i = 0; i < len; i++)
            va += v[i].glsl;
        this.varyingDefinition = va;
    };
    XBaseShader.prototype.getVariableDefinition = function () {
        var result = this.varyingDefinition;
        if (this.disableVaryings)
            result = "";
        var i, len = this.uniforms.length;
        var c, e;
        for (i = 0; i < len; i++)
            if (this.uniforms[i].enabled) {
                e = this.uniforms[i];
                result += e.glsl;
                c = e.initElementName;
                if (c != "")
                    this.codeInit.addCodeAfter(c);
            }
        len = this.constants.length;
        for (i = 0; i < len; i++)
            if (this.constants[i].enabled)
                result += this.constants[i].glsl;
        return result;
    };
    Object.defineProperty(XBaseShader.prototype, "glsl", {
        get: function () {
            var result = "";
            result += this.getVariableDefinition() + "\n";
            result += this.raw.glsl + "\n";
            result += "void main(void){\n";
            result += this.codeInit.glsl + "\n";
            result += this.mainCode.glsl + "\n";
            result += "}";
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return XBaseShader;
}());
