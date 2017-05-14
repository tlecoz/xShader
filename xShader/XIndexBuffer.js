///<reference path="../libs/threejs/three.d.ts"/>
var XIndexBuffer = (function () {
    function XIndexBuffer(datas) {
        if (datas === void 0) { datas = null; }
        if (datas) {
            this.create(datas);
        }
    }
    Object.defineProperty(XIndexBuffer.prototype, "array", {
        get: function () { return this.datas; },
        enumerable: true,
        configurable: true
    });
    XIndexBuffer.prototype.create = function (datas) {
        if (datas.splice)
            this.datas = new Uint32Array(datas);
        else
            this.datas = datas;
        this.bufferAttribute = new THREE.BufferAttribute(this.datas, 1);
    };
    XIndexBuffer.prototype.set = function (datas, offset) {
        if (offset === void 0) { offset = 0; }
        if (!this.bufferAttribute)
            this.create(datas);
        else {
            this.bufferAttribute.set(datas, offset);
            this.bufferAttribute.needsUpdate = true;
        }
    };
    XIndexBuffer.prototype.addToGeometry = function (g) {
        g.setIndex(this.bufferAttribute);
    };
    //-----------------------------
    XIndexBuffer.createQuadIndexBuffer = function (nbQuad) {
        var i, n = 0;
        var datas = [];
        for (i = 0; i < nbQuad; i++) {
            datas.push(n + 0, n + 1, n + 2, n + 1, n + 3, n + 2);
            n += 4;
        }
        return new XIndexBuffer(datas);
    };
    XIndexBuffer.createTriangleIndexBuffer = function (nbTriangle) {
        var i, k = 0;
        var datas = [];
        for (i = 0; i < nbTriangle; i++) {
            datas.push(k++, k++, k++);
        }
        return new XIndexBuffer(datas);
    };
    return XIndexBuffer;
}());
