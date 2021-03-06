var vsprintf = require('sprintf').sprintf;
var request = require('request');
var prettyjson = require('prettyjson');

var CodeshipGateway = function(server, apiKey) {
  this.server = server; //TODO: remove hard coded default after integration tests.
  this.apiKey = apiKey;
  console.log(this);
  console.log(arguments)
};

//TODO: branches should be removed - this is just to easily test build transition on a throw away branch. 
//TODO: support for both https and http
var uriBuildLocatorBase = 'http://%s//api/v1/projects/%s.json?api_key=%s';

CodeshipGateway.prototype = {
  getBuildsForProjectId: function(projectId, callback) {
    if (!projectId) {
      callback("Hmmmm...  you asked me to check a null build.", undefined);
      return;
    }

    var uri = vsprintf(uriBuildLocatorBase, this.server, projectId, this.apiKey);

    console.log('\rSending request to: ' + uri);
    var options = {
      url: uri,
      method: 'GET',
      json: true,
      headers: {
        'accept': 'application/json'
      }
    };

    request(options, function(error, response, body) {
      if (error) {
        console.log(prettyjson.render(error));
        if(error.code == "ECONNREFUSED"){
          console.error("Connection refused from uri: " + uri);
        }
        // if you get UNABLE_TO_VERIFY_LEAF_SIGNATURE
        // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        callback(error, null);
      }
      if (response.statusCode === 404) {
        console.error("HTTP Response 404 when searching for: " + uri);
        callback(vsprintf("Build %s not found", projectId));
      }
      // console.log(prettyjson.render(body));

      callback(null, body);
    });
  }
};

module.exports = CodeshipGateway;