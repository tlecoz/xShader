/// <reference path="../../../three.d.ts" />
/// <reference path="../../../three-vrcontrols.d.ts" />
var _vrControls = new THREE.VRControls(new THREE.Camera());
_vrControls.update();
_vrControls.scale = 25;
window.addEventListener("keydown", function (ev) {
    if (ev.keyCode == "R".charCodeAt(0)) {
        _vrControls.zeroSensor();
    }
});
window.addEventListener("touchstart", function (ev) {
    _vrControls.zeroSensor();
});
//# sourceMappingURL=vrcontrols.js.map