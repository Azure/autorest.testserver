var express = require('express');
var router = express.Router();
var utils = require('../util/utils')

var lroParameterizedEndpoints = function(coverage) {
    coverage['LROParameterizedEndpoint'] = 0;

    router.post('/', function (req, res, next) {
        var pollingUri = '/lroParameterizedEndpoints/results/1';
        var headers = {
          'Location': pollingUri
        };

        res.set(headers).status(202).end();
    });

    router.get('/results/:resultNumber', function (req, res, next) {
        coverage['LROParameterizedEndpoint']++;
        res.status(200).json("success");
        return;
    })

}

lroParameterizedEndpoints.prototype.router = router;

module.exports = lroParameterizedEndpoints;
