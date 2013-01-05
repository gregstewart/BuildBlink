var vsprintf = require('sprintf').sprintf;
var request = require('request');

var TeamCityGateway = function(server) {
		this.server = server || '192.168.1.194:81'; //TODO: remove hard coded default after integration tests.
	};

var uriBuildLocatorBase = 'http://%s/guestAuth/app/rest/buildTypes/id:%s/builds?locator=running:any,lookupLimit:2';

TeamCityGateway.prototype = {
	getBuildsForProjectId: function(projectId, callback) {
		if(!projectId) {
			callback("Hmmmm...  you asked me to check a null build.", undefined);
			return;
		}

		var uri = vsprintf(uriBuildLocatorBase, this.server, projectId);

		console.log('\rSending request to: ' + uri);
		var options = {
			url: uri,
			json: true,
			headers: {'Accept': 'application/json'}
		};
		request(options, function(error, response, body) {
			if(error) {
				callback(error, null);
			}
			if(response.statusCode == 404) {
				callback(vsprintf("Build %s not found", projectId));
			}
			callback(null, body);
		});
	}
};

module.exports = TeamCityGateway;