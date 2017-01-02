// Initialize Firebase
var config = {
    apiKey: "XXX",
    authDomain: "XXXfirebaseapp.com",
    databaseURL: "https://XXX.firebaseio.com",
    storageBucket: "XXX.appspot.com",
    messagingSenderId: "XXX"
};
firebase.initializeApp(config);
var db = firebase.database();

// CONSTANTS
var recordingInterval = 6000
var recordingLength = 5000

var audio_context;
var recorder;

function recordAudio() {
    recorder.record()
    console.log("started recording")
    setTimeout(function() {
        recorder.stop()
        console.log("stopped recording")
        recorder.exportWAV(function(blob) {
            var fd = new FormData();
            fd.append('fname', 'test.wav');
            fd.append('data', blob);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:5050/upload',
                data: fd,
                processData: false,
                contentType: false
            }).done(function(data) {
                console.log(data);
            });
        })
        recorder.clear()
    }, recordingLength);
}

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //console.log('Input connected to audio context destination.');

    recorder = new Recorder(input);
    console.log('Recorder initialised.');

    recordAudio()
    setInterval(recordAudio, recordingInterval);  // record samlpes every x seconds

}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log('No live audio input: ' + e);
    });

};