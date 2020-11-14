var express = require('express');
var router = express.Router();
var util = require('util');
var utils = require('../util/utils');

var pagingSpecial = function(optionalCoverage) {
    optionalCoverage['PagingSpecialNextLinkInResponseHeaders'] = 0;
    optionalCoverage['PagingSpecialContinuationToken'] = 0;
    optionalCoverage["PagingSpecialContinuationTokenInResponseHeaders"] = 0;
    optionalCoverage["PagingSpecialContinuationTokenWithMetadata"] = 0;


    router.get('/nextLinkInResponseHeaders', function(req, res, next) {
        var headers = {
            'x-ms-nextLink': '/pagingSpecial/nextLinkInResponseHeaders/page/2',
        };
        res.set(headers).status(200).json({ "value" : [ {"properties":{"name": "Product" }}] });
    });


    router.get('/nextLinkInResponseHeaders/page/:pagenumber', function(req, res, next) {
        if (req.params.pagenumber < 10) {
            var headers = {
                'x-ms-nextLink': '/pagingSpecial/nextLinkInResponseHeaders/page/'  + (++req.params.pagenumber),
            };
            res.set(headers).status(200).json({"value": [ {"properties":{"name": "product"}} ]});
        } else {
            optionalCoverage['PagingSpecialNextLinkInResponseHeaders']++;
            res.status(200).json({"value": [ {"properties":{"name": "product"}} ]});
        }
    });

    router.get('/continuationToken', function(req, res, next) {

        if (req.headers["x-ms-token"]) {
            contToken = req.headers["x-ms-token"]
            if (contToken < 10) {
                res.status(200).json({ "value": [ {"properties":{"name": "product"}} ], "token": ++contToken});
            } else {
                res.status(200).json({"value": [ {"properties":{"name": "product"}} ]});
            }

        } else {
            optionalCoverage['PagingSpecialContinuationToken']++;
            res.status(200).json({ "value": [ {"properties":{"name": "product"}} ], "token": 2});
        }

    });

    router.get('/continuationTokenInResponseHeaders', function(req, res, next) {

        if (req.headers["x-ms-token"]) {
            contToken = req.headers["x-ms-token"]
            if (contToken < 10) {
                var headers = {
                    "x-ms-token": ++contToken,
                };
                res.set(headers).status(200).json({ "value" : [ {"properties":{"name": "Product" }}] });
            } else {
                optionalCoverage["PagingSpecialContinuationTokenInResponseHeaders"]++;
                res.status(200).json({"value": [ {"properties":{"name": "product"}} ]});
            }

        } else {
            var headers = {
                "x-ms-token": 2,
            };
            res.set(headers).status(200).json({ "value" : [ {"properties":{"name": "Product" }}] });
        }

    });

    router.get('/tokenWithMetadata', function(req, res, next) {
        if (req.headers["x-ms-token"]) {
            contToken = req.headers["x-ms-token"]
            if (contToken < 10) {
                res.status(200).json({ "value": [ {"properties":{"name": "product"}} ], "token": ++contToken + ";10"});
            } else {
                optionalCoverage['PagingSpecialContinuationTokenWithMetadata']++;
                res.status(200).json({"value": [ {"properties":{"name": "product"}} ]});
            }

        } else {
            res.status(200).json({ "value": [ {"properties":{"name": "product"}} ], "token": "2;10"});
        }
    });

};

pagingSpecial.prototype.router = router;

module.exports = pagingSpecial;
