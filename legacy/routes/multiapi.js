var express = require('express');
var router = express.Router();
var utils = require('../util/utils');

var multiapi = function(coverage) {
    coverage['Multiapi'] = 0;

    router.put('/testOneEndpoint', function (req, res, next) {
        if (req.query["api-version"] === '1.0.0') {
            res.status(200).end();
        } else if (req.query["api-version"] === '2.0.0') {
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else {
            utils.send400(res, next, "The api version of the operation mixin is not supported: " + req.query['api-version']);
        }
    });
    router.get('/one/testTwoEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '1.0.0') {
            res.status(200).end()
        } else if (req.query["api-version"] == '2.0.0') {
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else if (req.query["api-version"] == '3.0.0') {
            res.status(200).type('json').end('{ "optionalProperty": "This was called with api-version 3.0.0" }');
        } else {
            utils.send400(res, next, "The api version of testTwo is not supported: " + req.query['api-version']);
        }
    });
    router.put('/one/testThreeEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testThree is not supported: " + req.query['api-version']);
        }
    });
    router.put('/two/testFourEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            res.status(200).end();
        } else if (req.query["api-version"] == '3.0.0') {
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testFour is not supported: " + req.query['api-version']);
        }
    });
    router.put('/two/testFiveEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '3.0.0') {
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testFive is not supported: " + req.query['api-version']);
        }
    });
}

multiapi.prototype.router = router;

module.exports = multiapi;