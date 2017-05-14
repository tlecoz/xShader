/**
 * Created by TOM on 08/03/2017.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../XShaderModule.ts"/>
var MouseModule = (function (_super) {
    __extends(MouseModule, _super);
    function MouseModule(isVarying) {
        if (isVarying === void 0) { isVarying = false; }
        _super.call(this, "MouseModule");
        this.mouse = new THREE.Vector4(0, 0, 0, 0);
        this.setVertexUniform("mouseObj", this.mouse).isVarying = isVarying;
        this.setStructure("Mouse", [
            { name: "position", type: "vec2" },
            { name: "press", type: "float" },
            { name: "wheelSpeed", type: "float" }
        ]);
        this.vertex.mainInit.define("\n            mouse = Mouse(mouseObj.xy,mouseObj.z,mouseObj.w);\n        ");
        var th = this;
        document.body.onmousedown = function () {
            th.mouse.z = 1;
        };
        document.body.onmouseup = function () {
            th.mouse.z = 0;
        };
        document.body.onwheel = function (ev) {
            th.mouse.w += ev.wheelDelta;
        };
        document.body.onmousemove = function (ev) {
            th.mouse.x = ev.clientX - window.innerWidth / 2;
            th.mouse.y = -(ev.clientY - window.innerHeight / 2);
        };
    }
    return MouseModule;
}(XShaderModule));
//# sourceMappingURL=MouseModule.js.map