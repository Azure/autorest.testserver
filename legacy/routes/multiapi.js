var express = require('express');
var router = express.Router();
var utils = require('../util/utils');

var multiapi = function(coverage) {
    optionalCoverage['putTestOneApiVersionOne'] = 0;
    optionalCoverage['putTestOneApiVersionTwo'] = 0;
    optionalCoverage['getTestTwoApiVersionOne'] = 0;
    optionalCoverage['getTestTwoApiVersionTwo'] = 0;
    optionalCoverage['getTestTwoApiVersionThree'] = 0;
    optionalCoverage['putTestThreeApiVersionTwo'] = 0;
    optionalCoverage['putTestFourApiVersionTwo'] = 0;
    optionalCoverage['putTestFourApiVersionThree'] = 0;
    optionalCoverage['putTestFiveApiVersionThree'] = 0;

    router.put('/testOneEndpoint', function (req, res, next) {
        if (req.query["api-version"] === '1.0.0') {
            optionalCoverage['putTestOneApiVersionOne']++;
            res.status(200).end();
        } else if (req.query["api-version"] === '2.0.0') {
            optionalCoverage['putTestOneApiVersionTwo']++;
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else {
            utils.send400(res, next, "The api version of the operation mixin is not supported: " + req.query['api-version']);
        }
    });
    router.get('/one/testTwoEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '1.0.0') {
            optionalCoverage['getTestTwoApiVersionOne']++;
            res.status(200).end()
        } else if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['getTestTwoApiVersionTwo']++;
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else if (req.query["api-version"] == '3.0.0') {
            optionalCoverage['getTestTwoApiVersionThree']++;
            res.status(200).type('json').end('{ "optionalProperty": "This was called with api-version 3.0.0" }');
        } else {
            utils.send400(res, next, "The api version of testTwo is not supported: " + req.query['api-version']);
        }
    });
    router.put('/one/testThreeEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['putTestThreeApiVersionTwo']++;
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testThree is not supported: " + req.query['api-version']);
        }
    });
    router.put('/two/testFourEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['putTestFourApiVersionTwo']++;
            res.status(200).end();
        } else if (req.query["api-version"] == '3.0.0') {
            optionalCoverage['putTestFourApiVersionThree']++;
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testFour is not supported: " + req.query['api-version']);
        }
    });
    router.put('/two/testFiveEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '3.0.0') {
            optionalCoverage['putTestFiveApiVersionThree']++;
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testFive is not supported: " + req.query['api-version']);
        }
    });
}

multiapi.prototype.router = router;

module.exports = multiapi;