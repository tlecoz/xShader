///<reference path="XElement.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XBuffer = (function (_super) {
    __extends(XBuffer, _super);
    function XBuffer(name, nbComponent, datas, moduleName) {
        if (datas === void 0) { datas = null; }
        if (moduleName === void 0) { moduleName = ""; }
        _super.call(this, "attribute", name, nbComponent, moduleName);
        this.datas = null;
        if (datas)
            this.create(datas);
    }
    Object.defineProperty(XBuffer.prototype, "array", {
        get: function () { return this.datas; },
        enumerable: true,
        configurable: true
    });
    XBuffer.prototype.create = function (datas) {
        if (datas.splice)
            this.datas = new Float32Array(datas);
        else
            this.datas = datas;
        this.bufferAttribute = new THREE.BufferAttribute(this.datas, this.value);
    };
    XBuffer.prototype.set = function (datas, offset) {
        if (offset === void 0) { offset = 0; }
        if (!this.bufferAttribute)
            this.create(datas);
        else {
            this.bufferAttribute.set(datas, offset);
            this.bufferAttribute.needsUpdate = true;
        }
    };
    XBuffer.prototype.addToGeometry = function (g) {
        if (!g.attributes[this.realName])
            g.addAttribute(this.realName, this.bufferAttribute);
        else
            g.attributes[this.realName] = this.bufferAttribute;
        this.bufferAttribute.needsUpdate = true;
    };
    XBuffer.prototype.updateGeometry = function () {
        this.bufferAttribute.needsUpdate = true;
    };
    //#############################################################################
    XBuffer.createQuadUV_Buffer = function (name, nbQuad) {
        var i;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(0, 0);
            datas.push(1, 0);
            datas.push(0, 1);
            datas.push(1, 1);
        }
        return new XBuffer(name, 2, datas);
    };
    XBuffer.createQuadXY_Buffer = function (name, nbQuad) {
        var i;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(-0.5, -0.5);
            datas.push(+0.5, -0.5);
            datas.push(-0.5, +0.5);
            datas.push(+0.5, +0.5);
        }
        return new XBuffer(name, 2, datas);
    };
    XBuffer.createQuadXYZ_Buffer = function (name, nbQuad) {
        var i;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(-0.5, -0.5, 0.0);
            datas.push(+0.5, -0.5, 0.0);
            datas.push(-0.5, +0.5, 0.0);
            datas.push(+0.5, +0.5, 0.0);
        }
        return new XBuffer(name, 3, datas);
    };
    XBuffer.createQuadId_Buffer = function (name, nbQuad) {
        var i;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(i, i, i, i);
        }
        return new XBuffer(name, 1, datas);
    };
    XBuffer.createQuadVertexId_Buffer = function (name, nbQuad) {
        var i;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(0, 1, 2, 3);
        }
        return new XBuffer(name, 1, datas);
    };
    XBuffer.createQuadRGB_Buffer = function (name, nbQuad, randomColor) {
        if (randomColor === void 0) { randomColor = false; }
        var i;
        var datas = [];
        if (!randomColor) {
            for (i = 0; i < nbQuad; i++) {
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
            }
        }
        else {
            var r, g, b;
            for (i = 0; i < nbQuad; i++) {
                r = Math.random();
                g = Math.random();
                b = Math.random();
                datas.push(r, g, b);
                datas.push(r, g, b);
                datas.push(r, g, b);
                datas.push(r, g, b);
            }
        }
        return new XBuffer(name, 3, datas);
    };
    XBuffer.createQuadRGBA_Buffer = function (name, nbQuad, randomColor) {
        if (randomColor === void 0) { randomColor = false; }
        var i;
        var datas = [];
        if (!randomColor) {
            for (i = 0; i < nbQuad; i++) {
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
            }
        }
        else {
            var r, g, b, a;
            for (i = 0; i < nbQuad; i++) {
                r = Math.random();
                g = Math.random();
                b = Math.random();
                a = Math.random();
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
            }
        }
        return new XBuffer(name, 4, datas);
    };
    //-----------------------------
    XBuffer.createTriangleVec4Buffer = function (name, nbTriangle) {
        var i, j;
        var datas = [];
        for (i = 0; i < nbTriangle; i++) {
            datas.push(0, 0, 0, 0);
            datas.push(0, 0, 0, 0);
            datas.push(0, 0, 0, 0);
        }
        return new XBuffer(name, 4, datas);
    };
    XBuffer.createTriangleVec3Buffer = function (name, nbTriangle) {
        var i, j;
        var datas = [];
        for (i = 0; i < nbTriangle; i++) {
            datas.push(0, 0, 0);
            datas.push(0, 0, 0);
            datas.push(0, 0, 0);
        }
        return new XBuffer(name, 3, datas);
    };
    return XBuffer;
}(XElement));
