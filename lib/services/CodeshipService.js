var CodeshipGateway = require('../gateways/CodeshipGateway'),
    BuildActivity = require('../domain/BuildActivity'),
    dataBuilder = require('../domain/DataBuilder');

var Seq = require('seq');


var CodeshipService = function (config, injectableGateway) {
  'use strict';
  this.config = config;
  this.gateway = injectableGateway || new CodeshipGateway(config.host, config.apiKey);
};

CodeshipService.prototype = {
    getBuildActivityForBuildId: function(buildId, callback) {
      'use strict';
      this.gateway.getBuildsForProjectId(buildId, function(err, jsonBuildActivity) {

        var data = dataBuilder.normalize(jsonBuildActivity, 'CodeShip');
        var build = new BuildActivity(data);

        callback(null, build);
      });
    },
    getAllBuilds: function(callback) {
      'use strict';

      var that = this;

      Seq(this.config.codeshipBuildNumbers)
          .flatten()
          .parMap(function(buildConfig) {
            that.getBuildActivityForBuildId(buildConfig.id,this);
          })
          .seq(function(){
            callback(null,this.stack);
          });
    }
  };
module.exports = CodeshipService;