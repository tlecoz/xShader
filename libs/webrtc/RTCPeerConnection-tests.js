/// <reference path="MediaStream.d.ts" />
/// <reference path="RTCPeerConnection.d.ts" />
var voidpromise;
var minimalConfig = {};
var config = {
    iceServers: [
        {
            // Single url
            urls: "stun.l.google.com:19302"
        },
        {
            // List of urls and credentials
            urls: ["another-stun.example.com"],
            username: "dude",
            credential: "pass",
            credentialType: "token"
        },
    ],
    iceTransportPolicy: "relay",
    bundlePolicy: "max-compat",
    rtcpMuxPolicy: "negotiate",
    peerIdentity: "dude",
    certificates: [{ expires: 1337 }],
    iceCandidatePoolSize: 5
};
var constraints = { mandatory: { offerToReceiveAudio: true, offerToReceiveVideo: true } };
var peerConnection = new RTCPeerConnection(config, constraints);
navigator.getUserMedia({ audio: true, video: true }, function (stream) {
    peerConnection.addStream(stream);
}, function (error) {
    console.log('Error message: ' + error.message);
    console.log('Error name: ' + error.name);
});
peerConnection.onaddstream = function (ev) { return console.log(ev.type); };
peerConnection.ondatachannel = function (ev) { return console.log(ev.channel); };
peerConnection.oniceconnectionstatechange = function (ev) { return console.log(ev.type); };
peerConnection.onnegotiationneeded = function (ev) { return console.log(ev.type); };
peerConnection.onopen = function (ev) { return console.log(ev.type); };
peerConnection.onicecandidate = function (ev) { return console.log(ev.type); };
peerConnection.onremovestream = function (ev) { return console.log(ev.type); };
peerConnection.onstatechange = function (ev) { return console.log(ev.type); };
peerConnection.createOffer();
var offer2 = peerConnection.createOffer({
    voiceActivityDetection: true,
    iceRestart: false
});
var type = RTCSdpType[RTCSdpType.offer];
var offer = { type: type, sdp: "some sdp" };
var sessionDescription = new RTCSessionDescription(offer);
peerConnection.setRemoteDescription(sessionDescription).then(function () { return peerConnection.createAnswer(); }, function (error) { return console.log('Error setting remote description: ' + error + "; offer.sdp=" + offer.sdp); });
var webkitSessionDescription = new webkitRTCSessionDescription(offer);
// New syntax
voidpromise = peerConnection.setLocalDescription(webkitSessionDescription);
// Legacy syntax
peerConnection.setRemoteDescription(webkitSessionDescription, function () {
    peerConnection.createAnswer(function (answer) {
        peerConnection.setLocalDescription(answer, function () { return console.log('Set local description'); }, function (error) { return console.log("Error setting local description from created answer: " + error +
            "; answer.sdp=" + answer.sdp); });
    }, function (error) { return console.log("Error creating answer: " + error); });
}, function (error) { return console.log('Error setting remote description: ' + error +
    "; offer.sdp=" + offer.sdp); });
var mozSessionDescription = new mozRTCSessionDescription(offer);
peerConnection.setRemoteDescription(mozSessionDescription);
var wkPeerConnection = new webkitRTCPeerConnection(config, constraints);
var candidate = { 'candidate': 'foobar' };
voidpromise = peerConnection.addIceCandidate(candidate);
//# sourceMappingURL=RTCPeerConnection-tests.js.map