var express = require('express');
var router = express.Router();

var coverageEndpoint = function(coverage) {
    router.get('/', function(req, res, next) {
        res.status(200).send(coverage);
    });
}

coverageEndpoint.prototype.router = router;

module.exports = coverageEndpoint;