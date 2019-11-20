var express = require('express');
var router = express.Router();

var coverageEndpoint = function(coverage) {
    router.get('/', function(req, res, next) {
        res.status(200).send(coverage);
    });

    router.post("/clear", function(req, res, next) {
        for (var property in Object.getOwnPropertyNames(coverage))
        {
            coverage[property] = 0;
        }
        res.status(200).send();
    });
}

coverageEndpoint.prototype.router = router;

module.exports = coverageEndpoint;