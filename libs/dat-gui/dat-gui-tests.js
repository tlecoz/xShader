/////////////////////////////////////////////////////////////
// http://workshop.chromeexperiments.com/examples/gui/
//////////////////////////////////////////////////////////////
/// <reference path="dat-gui.d.ts" />
// ------------ config
var FizzyText = function () {
    return {
        message: 'dat.gui',
        speed: 0.8,
        displayOutline: false,
        explode: function () { },
        noiseStrength: 0.5
    };
};
// ------------ 1. Basic Usage
(function () {
    window.onload = function () {
        var text = FizzyText();
        var gui = new dat.GUI();
        gui.add(text, 'message');
        gui.add(text, 'speed', -5, 5);
        gui.add(text, 'displayOutline');
        gui.add(text, 'explode');
    };
});
// ------------ 2. Constraining Input
(function () {
    var text = FizzyText();
    var gui = new dat.GUI();
    gui.add(text, 'noiseStrength').step(5); // Increment amount
    gui.add(text, 'growthSpeed', -5, 5); // Min and max
    gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match
    // Choose from accepted values
    gui.add(text, 'message', ['pizza', 'chrome', 'hooray']);
    // Choose from named values
    gui.add(text, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 });
});
// ------------ 3. Folders
(function () {
    var text = FizzyText();
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Flow Field');
    f1.add(text, 'speed');
    f1.add(text, 'noiseStrength');
    var f2 = gui.addFolder('Letters');
    f2.add(text, 'growthSpeed');
    f2.add(text, 'maxSize');
    f2.add(text, 'message');
    f2.open();
});
// ------------ 4. Color Controllers
(function () {
    var FizzyText = function () {
        return {
            color0: "#ffae23",
            color1: [0, 128, 255],
            color2: [0, 128, 255, 0.3],
            color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
        };
    };
    window.onload = function () {
        var text = FizzyText();
        var gui = new dat.GUI();
        gui.addColor(text, 'color0');
        gui.addColor(text, 'color1');
        gui.addColor(text, 'color2');
        gui.addColor(text, 'color3');
    };
});
// ------------ 5. Saving Values
(function () {
    var fizzyText = FizzyText();
    var gui = new dat.GUI();
    gui.remember(fizzyText);
});
// ------------ 6. Presets
(function () {
    var gui = new dat.GUI({
        load: JSON,
        preset: 'Flow'
    });
});
// ------------ 7. Events
(function () {
    var fizzyText = FizzyText();
    var gui = new dat.GUI();
    var controller = gui.add(fizzyText, 'maxSize', 0, 10);
    controller.onChange(function (value) {
        // Fires on every change, drag, keypress, etc.
    });
    controller.onFinishChange(function (value) {
        // Fires when a controller loses focus.
        alert("The new value is " + value);
    });
});
// ------------ 8. Custom Placement
(function () {
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);
});
// ------------ 9. Updating the Display Automatically
(function () {
    var fizzyText = FizzyText();
    var gui = new dat.GUI();
    gui.add(fizzyText, 'noiseStrength', 0, 100).listen();
    var update = function () {
        requestAnimationFrame(update);
        fizzyText.noiseStrength = Math.random();
    };
    update();
});
// ------------ 10. Updating the Display Manually
(function () {
    var fizzyText = FizzyText();
    var gui = new dat.GUI();
    gui.add(fizzyText, 'noiseStrength', 0, 100);
    var update = function () {
        var dt = new Date();
        requestAnimationFrame(update);
        fizzyText.noiseStrength = Math.cos(dt.getTime());
        // Iterate over all controllers
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    };
    update();
});
// ------------ 11. Object Literal Tests
(function () {
    var obj = { a: 1, b: 1 };
    var gui = new dat.GUI();
    var controller = gui.add(obj, 'maxSize', 0, 10);
    controller.onChange(function (value) {
        // Fires on every change, drag, keypress, etc.
    });
    controller.onFinishChange(function (value) {
        // Fires when a controller loses focus.
        alert("The new value is " + value);
    });
});
//# sourceMappingURL=dat-gui-tests.js.map