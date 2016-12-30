// MODULE IMPORTS
var config = require('./config.json');
var twilio = require('twilio');

// INIT
var client = new twilio.RestClient(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

var MessageService = function (){
    var self = this;

    self.sendMessage = function (messageBody, toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: messageBody
        },
        function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    };

    self.welcomeMessage = function (title, toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: "Welcome to " + title + "!"
        },
        function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }

    self.provideInfo = function (toNumber) {
        var messageBody =  `Using sway is easy, just send intuitive text commands to the DJ

Supported Commands:

request <song name> - Submit a song request to the DJ

<good/bad> - Let the DJ know if you're enjoying the music

energy <1 - 5> - Specify your energy preference

volume <up/down> - Specify your volume preference

join <session identifier> - Join a session (session identifier provided by DJ/venue)

sway - See these commands again`

        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: messageBody
        },
        function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }

    self.confirmFeedback = function (toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: "Feedback noted!"
        }, function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }

    self.unrecognizedCommand = function (toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: "Sorry we didn't recognize that command! Text 'sway' for intructions!"
        }, function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }

    self.userNotInSession = function(toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: `You must join a session before you provide feedback! Text "join <session identifier>"  The session number should be provided to you by the venue or dj.`
        }, function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }

    self.invalidSessionNumber = function(toNumber) {
        client.sendMessage({
            to: toNumber,
            from: config.SWAY_NUMBER,
            body: `That session doens't exist! Double check your session identifier.`
        }, function(error, message) {
            if (!error) {
                console.log('SENT: ', message.body)
            } else {
                console.log('ERROR: ', error);
            }
        });
    }
};

module.exports = MessageService;