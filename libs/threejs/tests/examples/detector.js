/// <reference path="../../three.d.ts" />
/// <reference path="../three-tests-setup.ts" />
(function () {
    if (!Detector.canvas || !Detector.webgl || !Detector.workers || !Detector.fileapi) {
        var errorElement = Detector.getWebGLErrorMessage();
        Detector.addGetWebGLMessage();
    }
});
//# sourceMappingURL=detector.js.map