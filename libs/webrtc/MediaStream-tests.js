///<reference path="MediaStream.d.ts" />
var mediaStreamConstraints = { audio: true, video: true };
var mediaTrackConstraintSet = {};
var mediaTrackConstraintArray = [];
var mediaTrackConstraints = mediaTrackConstraintSet;
var mediaTrackConstraints2 = { advanced: mediaTrackConstraintArray };
navigator.getUserMedia(mediaStreamConstraints, function (stream) {
    var track = stream.getTracks()[0];
    console.log('label:' + track.label);
    console.log('ended:' + track.readyState);
    track.onended = function (event) { return console.log('Track ended'); };
    var objectUrl = URL.createObjectURL(stream);
}, function (error) {
    console.log('Error message: ' + error.message);
    console.log('Error name: ' + error.name);
});
navigator.webkitGetUserMedia(mediaStreamConstraints, function (stream) {
    var track = stream.getTracks()[0];
    console.log('label:' + track.label);
    console.log('ended:' + track.readyState);
    track.onended = function (event) { return console.log('Track ended'); };
    var objectUrl = URL.createObjectURL(stream);
}, function (error) {
    console.log('Error message: ' + error.message);
    console.log('Error name: ' + error.name);
});
navigator.mozGetUserMedia(mediaStreamConstraints, function (stream) {
    var track = stream.getTracks()[0];
    console.log('label:' + track.label);
    console.log('ended:' + track.readyState);
    track.onended = function (event) { return console.log('Track ended'); };
    var objectUrl = URL.createObjectURL(stream);
}, function (error) {
    console.log('Error message: ' + error.message);
    console.log('Error name: ' + error.name);
});
//# sourceMappingURL=MediaStream-tests.js.map