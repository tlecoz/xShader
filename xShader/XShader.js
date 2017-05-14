///<reference path="XShaderModule.ts" />
///<reference path="XIndexBuffer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XShader = (function (_super) {
    __extends(XShader, _super);
    function XShader(geometry) {
        if (geometry === void 0) { geometry = null; }
        _super.call(this);
        this.index = null;
        this.options = {};
        if (!geometry)
            this.geom = new THREE.BufferGeometry();
        else {
            if (geometry instanceof THREE.BufferGeometry)
                this.geom = geometry;
            else
                this.geom = new THREE.BufferGeometry().fromGeometry(geometry);
        }
    }
    Object.defineProperty(XShader.prototype, "materialOptions", {
        get: function () { return this.options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XShader, "DEFAULT_TEXTURE", {
        get: function () {
            if (!XShader._DEFAULT_TEXTURE) {
                var canvas = document.createElement("canvas");
                canvas.width = canvas.height = 1;
                XShader._DEFAULT_TEXTURE = new THREE.Texture(canvas);
            }
            return XShader._DEFAULT_TEXTURE;
        },
        enumerable: true,
        configurable: true
    });
    XShader.prototype.createMaterial = function () {
        this.material = new THREE.ShaderMaterial(this.compile());
        for (var z in this.materialOptions)
            this.material[z] = this.materialOptions[z];
        this.linkToGeometry(this.geom);
        return this.material;
    };
    XShader.prototype.createMesh = function () {
        if (!this.material)
            this.createMaterial();
        return new THREE.Mesh(this.geom, this.material);
    };
    XShader.prototype.linkToGeometry = function (g) {
        var att = this.attributes.__elements;
        var i, len = att.length;
        for (i = 0; i < len; i++)
            att[i].addToGeometry(g);
        if (this.index)
            this.index.addToGeometry(g);
    };
    XShader.prototype.setIndex = function (indices) {
        if (!this.index) { }
        this.index = new XIndexBuffer(indices);
    };
    XShader.prototype.setIndexBuffer = function (buffer) {
        this.index = buffer;
        return buffer;
    };
    return XShader;
}(XShaderModule));
