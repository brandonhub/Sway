// MODULE IMPORTS
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');

// CUSTOM IMPORTS
var DbService = require('./db_service');

// INIT
var defaultOptions = {
  host: 'us-west-2.api.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type:'audio',
  secure: true,
  access_key: 'a0269f90c10683eb40c0b3c3a2a49429',
  access_secret: 'kMbUABfwibVumMnA7rEQHQQDWZCE2fGeo9YFKUWy'
};

var dbService = new DbService();

//LOGIC
function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer(signString, 'utf-8'))
    .digest().toString('base64');
}


/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {

  var current_data = new Date();
  var timestamp = current_data.getTime()/1000;

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  }
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

var FpService = function (){
    var self = this;
    self.identifySong = function(filename, response) {

        var bitmap = fs.readFileSync(filename);
        identify(new Buffer(bitmap), defaultOptions, function (err, httpResponse, body) {
            if (err) {
                console.log(err);
                response.send(error);
                return;
            }

            var result = JSON.parse(body);
            var statusCode = result["status"]["code"]
            if (statusCode != 0) {   // Song not found
                console.log("A problem occured: ", result);
                response.send(result);
                return;
            }
            var songName = result["metadata"]["music"][0]["title"]
            var songId = result["metadata"]["music"][0]["external_metadata"]["spotify"]["track"]["id"]
            dbService.addSongToTracker(songName, songId)
            response.send(result["status"]["msg"])
        });
    }
}

module.exports = FpService;
