// MODULE IMPORTS
var config = require('./config.json');
var firebase = require('firebase');
var request = require('request');
var LookupsClient = require('twilio').LookupsClient;

// CUSTOM IMPORTS
var MessageService = require('./message_service');

// INIT
firebase.initializeApp({
    serviceAccount: "sway-5a5bf6d5a342.json",
    databaseURL: config.FIREBASE_DATABASE_URL
});
var db = firebase.database();

var lookupClient = new LookupsClient(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
var messageService = new MessageService();

// LOGIC
var DbService = function (){
    var self = this;

    self.validateUserStatus = function (userId, callback) {
        db.ref("users").child(userId).once("value", function(snapshot) {
            if (snapshot.val() != null && snapshot.val().currentSession != null) {
                var currentSessionId = snapshot.val().currentSession
                callback(currentSessionId)
            }
            else{
                messageService.userNotInSession(userId)
            }
        })
    }

    self.startMessageQueue = function () {  // Starts listening for new entires in the queue
        db.ref("message_queue").on("child_added", function(snapshot) {  // whenever new message is added, send it and delete it
            messageService.sendMessage(snapshot.val().body, snapshot.val().toNumber)
            db.ref("message_queue/" + snapshot.key).set(null)
        })
    }

    self.addUserToSession = function (userId, sessionId) {
        // Check if session number is valid
        db.ref("sessions/" + sessionId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {

                db.ref("users").child(userId).once("value", function(snapshot) {

                    var exists = (snapshot.val() !== null)  // check if user exists

                    if (exists) {
                        var currentSessionId = snapshot.val().currentSession
                        if (currentSessionId != null) {
                            db.ref("sessions/" + currentSessionId + "/members/" + userId).set(null)  // Remove user from current session
                        }
                    }

                    // Add user to new session
                    db.ref("sessions/" + sessionId + "/members/" + userId).set({
                        displayName: userId,
                        satisfaction: true,
                        volume: 0
                    });

                    // Update current session on user object
                    db.ref("users/" + userId).set({
                        displayName: userId,
                        currentSession: sessionId
                    })
                })

                messageService.welcomeMessage(snapshot.val().title, userId)
                messageService.provideInfo(userId)
            }
            else{
                messageService.invalidSessionNumber(userId)
            }
        });
    };

    self.updateSatisfaction = function(input, userId, sessionId) {
        var satisfaction = false
        if (input == "good" || input == "g") {
            satisfaction = true
        }
        else if (input == "bad" || input == "b") {
            satisfaction = false
        }
        else{
            return;
        }

        db.ref("sessions/" + sessionId + "/members/" + userId + "/satisfaction").set(satisfaction);
        messageService.confirmFeedback(userId)
    }

    self.updateVolume = function(input, userId, sessionId) {
        var volume = 0
        if (input == "up") {
            volume = 1
        }
        else if (input == "down") {
            volume = -1
        }
        else{
            messageService.sendMessage('To provide volume feedback, pleaese text "volume up" or "volume down"', userId)
            return;
        }

        db.ref("sessions/" + sessionId + "/members/" + userId + "/volume").set(volume);
        messageService.confirmFeedback(userId)
    }

    self.updateEnergy = function(input, userId, sessionId) {
        if (parseInt(input)) {
            var energy = parseInt(input)
            if (energy < 1 || energy > 5) {
                messageService.sendMessage(`To provide energy feedback, pleaese text "energy <a number between 1 and 5>"
Example: "energy 5"`, userId)
                return;
            }
            db.ref("sessions/" + sessionId + "/members/" + userId + "/energy").set(energy);
            messageService.confirmFeedback(userId)
        }
        else{
            messageService.sendMessage(`To provide energy feedback, pleaese text "energy <a number between 1 and 5>"
Example: "energy 5"`, userId)
        }
    }

    self.serviceSongRequest = function(input, userId, sessionId) {
        var searchSegments = input.slice(1);
        var searchQuery = "";
        for (var i = 0; i < searchSegments.length; i++) {
            if (i < searchSegments.length - 1) {
                searchQuery += searchSegments[i] + "+";
            }
            else{
                searchQuery += searchSegments[i];
            }
        }
        request('https://itunes.apple.com/search?term=' + searchQuery + '&entity=song&limit=1', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (JSON.parse(response.body)["results"].length > 0) {
                    var result = JSON.parse(response.body)["results"][0]

                    var trackId = result["trackId"];
                    var name = result["trackName"];
                    var artist = result["artistName"];
                    var previewUrl = result["previewUrl"];
                    var artworkUrl = result["artworkUrl60"];
                    var iTunesUrl = result["trackViewUrl"];
                    self.addSongRequest(userId, sessionId, trackId, name, artist, previewUrl, artworkUrl, iTunesUrl)
                }
                else{
                    messageService.sendMessage("Sorry we coundn't find that song! Check your search term or try another request!", userId)
                }
            }
        })
    }

    self.addSongRequest = function(userId, sessionId, trackId, name, artist, previewUrl, artworkUrl, iTunesUrl) {
        // Check if request is new
        db.ref("sessions/" + sessionId  + "/requests/" + trackId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {   // If is is update the count
                var count = snapshot.val().count
                db.ref("sessions/" + sessionId + "/requests/" + trackId + "/count").set(count + 1);
            }else{  // Otherwise add it to the list
                db.ref("sessions/" + sessionId + "/requests/" + trackId).set({
                    trackId: trackId,
                    name: name,
                    artist: artist,
                    previewUrl: previewUrl,
                    artworkUrl: artworkUrl,
                    iTunesUrl: iTunesUrl,
                    count: 1
                });
            }
            messageService.confirmFeedback(userId)
        });
    }

    self.addSongToTracker = function(songName, songId) {
        db.ref("song_tracker/" + songId + "/songName").set(songName)
    }
};

module.exports = DbService;