// MODULE IMPORTS
var express = require('express');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy'); //middleware for form/file upload
var firebase = require('firebase');
var twilio = require('twilio');
var request = require('request');
var fs = require('fs-extra');

// CUSTOM IMPORTS
var MessageService = require('./message_service');
var DbService = require('./db_service');
var FpService = require('./fp_service');

// INIT
var app = express();
var messageService = new MessageService();
var dbService = new DbService();
var fpService = new FpService();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(busboy());
dbService.startMessageQueue()

// ROUTES
app.post("/message", function(request, response) {

    var command = request.body.Body.toLowerCase().split(" ")
    var userId = request.body.From

    if (command[0] == "sway") {
        messageService.provideInfo(userId)
    } else if (command[0] == "join") {
        dbService.addUserToSession(userId, command[1])
    } else {
        dbService.validateUserStatus(userId, function(sessionId) {
            switch (command[0]) {
                case "good":
                case "bad":
                    dbService.updateSatisfaction(command[0], userId, sessionId)
                    break;
                case "energy":
                    dbService.updateEnergy(command[1], userId, sessionId);
                    break;
                case "volume":
                    dbService.updateVolume(command[1], userId, sessionId);
                    break;
                case "request":
                    dbService.serviceSongRequest(command, userId, sessionId);
                    break;
                default:
                    messageService.unrecognizedCommand(userId);
            }
        })
    }
});

app.get("/", function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.post('/upload', function(request, response){
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    var fstream;
    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        //Path where image will be uploaded
        fstream = fs.createWriteStream(__dirname + '/recordings/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            fpService.identifySong('recordings/' + filename, response)
        });

    });
})

var listener = app.listen(5050, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});