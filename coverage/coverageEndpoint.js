var express = require('express');
var router = express.Router();

var coverageEndpoint = function(coverage) {
    router.get('/', function(req, res, next) {
        res.status(200).send(coverage);
    });

    router.post("/clear", function(req, res, next) {
        Object.getOwnPropertyNames(coverage).forEach(function(val, idx, array) {
            coverage[val] = 0;
        });

        res.status(200).send();
    });
}

coverageEndpoint.prototype.router = router;

module.exports = coverageEndpoint;