/// <reference path="../../../three.d.ts" />
/// <reference path="../../../three-vreffect.d.ts" />
var _this = this;
var _vrEffect;
_vrEffect = new THREE.VREffect(new THREE.WebGLRenderer({ antialias: true }), function (error) {
    if (error) {
        _this._stats.classList.add("error");
        _this._stats.innerHTML = "WebVR API not supported";
        _this._vrAvailable = false;
    }
});
_vrEffect.setSize(100, 100);
_vrEffect.render(new THREE.Scene(), new THREE.Camera());
_vrEffect.setFullScreen(true);
//# sourceMappingURL=vreffect.js.map