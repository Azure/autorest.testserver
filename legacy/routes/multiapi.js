var express = require('express');
var router = express.Router();
var utils = require('../util/utils');

var multiapi = function(optionalCoverage) {
    optionalCoverage['MultiapiPutTestOneApiVersionOne'] = 0;
    optionalCoverage['MultiapiPutTestOneApiVersionTwo'] = 0;
    optionalCoverage['MultiapiGetTestTwoApiVersionOne'] = 0;
    optionalCoverage['MultiapiGetTestTwoApiVersionTwo'] = 0;
    optionalCoverage['MultiapiGetTestTwoApiVersionThree'] = 0;
    optionalCoverage['MultiapiPutTestThreeApiVersionTwo'] = 0;
    optionalCoverage['MultiapiPostTestFourApiVersionTwo'] = 0;
    optionalCoverage['MultiapiPostTestFourApiVersionThreeJSON'] = 0;
    optionalCoverage['MultiapiPostTestFourApiVersionThreePDF'] = 0;
    optionalCoverage['MultiapiPutTestFiveApiVersionThree'] = 0;
    optionalCoverage['MultiapiLRO'] = 0;
    optionalCoverage['MultiapiPaging'] = 0;

    router.put('/testOneEndpoint', function (req, res, next) {
        if (req.query["api-version"] === '1.0.0') {
            optionalCoverage['MultiapiPutTestOneApiVersionOne']++;
            res.status(200).end();
        } else if (req.query["api-version"] === '2.0.0') {
            optionalCoverage['MultiapiPutTestOneApiVersionTwo']++;
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else {
            utils.send400(res, next, "The api version of the operation mixin is not supported: " + req.query['api-version']);
        }
    });

    // LRO
    router.put('/lro', function (req, res, next) {
        optionalCoverage['MultiapiLRO']++;
        res.status(200).type('json').end('{ "id": "100" }');
    });

    router.get('/paging', function(req, res, next) {
        optionalCoverage["MultiapiPaging"]++;
        res.status(200).json({ "values" : [ {"optionalProperty": "paged" }]});
    });

    router.get('/one/testTwoEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '1.0.0') {
            optionalCoverage['MultiapiGetTestTwoApiVersionOne']++;
            res.status(200).end()
        } else if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['MultiapiGetTestTwoApiVersionTwo']++;
            res.status(200).type('json').end('{ "id": "1", "message": "This was called with api-version 2.0.0" }');
        } else if (req.query["api-version"] == '3.0.0') {
            optionalCoverage['MultiapiGetTestTwoApiVersionThree']++;
            res.status(200).type('json').end('{ "optionalProperty": "This was called with api-version 3.0.0" }');
        } else {
            utils.send400(res, next, "The api version of testTwo is not supported: " + req.query['api-version']);
        }
    });
    router.put('/one/testThreeEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['MultiapiPutTestThreeApiVersionTwo']++;
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testThree is not supported: " + req.query['api-version']);
        }
    });
    router.post('/two/testFourEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '2.0.0') {
            optionalCoverage['MultiapiPostTestFourApiVersionTwo']++;
            res.status(200).end();
        } else if (req.query["api-version"] == '3.0.0') {
            let content_type = req.headers["content-type"];
            let body = req.body;
            console.log("Content-Type: "+content_type);
            console.log("Body: "+body);

            // JSON will expect to find a 'source' key
            if (content_type === 'application/json' && 'source' in body) {
                console.log("in if")
                optionalCoverage['MultiapiPostTestFourApiVersionThreeJSON']++;
                res.status(200).end();
            }
            // PDF will expect to see the 3 bytes PDF
            else if (content_type === 'application/pdf' && body === "PDF") {
                console.log("in else if")
                optionalCoverage['MultiapiPostTestFourApiVersionThreePDF']
                res.status(200).end();
            }
            else{
                console.log("else")
                utils.send400(res, next, 'Did not receive what I was expecting');
            }
        } else {
            utils.send400(res, next, "The api version of testFour is not supported: " + req.query['api-version']);
        }
    });
    router.put('/two/testFiveEndpoint', function(req, res, next) {
        if (req.query["api-version"] == '3.0.0') {
            optionalCoverage['MultiapiPutTestFiveApiVersionThree']++;
            res.status(200).end();
        } else {
            utils.send400(res, next, "The api version of testFive is not supported: " + req.query['api-version']);
        }
    });
}

multiapi.prototype.router = router;

module.exports = multiapi;