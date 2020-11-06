var express = require('express');
var router = express.Router();
var util = require('util');
var utils = require('../util/utils');

var pagingSpecial = function(optionalCoverage) {
    optionalCoverage['PagingSpecialNextLinkInResponseHeaders'] = 0;
    optionalCoverage["PagingSpecialContinuationTokenInResponseHeaders"] = 0;

    router.get('/nextLinkInResponseHeaders', function(req, res, next) {
        var headers = {
            'x-ms-nextLink': '/pagingSpecial/nextLinkInResponseHeaders/page/2',
        };
        res.set(headers).status(200).json({ "value" : [ {"properties":{"id": 1, "name": "Product" }}] });
    });


    router.get('/nextLinkInResponseHeaders/page/:pagenumber', function(req, res, next) {
        if (req.params.pagenumber < 10) {
            var headers = {
                'x-ms-nextLink': '/pagingSpecial/nextLinkInResponseHeaders/page/'  + (++req.params.pagenumber),
            };
            res.set(headers).status(200).json({"value": [ {"properties":{"id" : parseInt(req.params.pagenumber), "name": "product"}} ]});
        } else {
            optionalCoverage['PagingSpecialNextLinkInResponseHeaders'] = 0;
            res.status(200).json({"value": [ {"properties":{"id" : parseInt(req.params.pagenumber), "name": "product"}} ]});
        }
    });

    router.get('/continuationTokenInResponseHeaders', function(req, res, next) {
        
        if (req.headers['continuationtoken']) {
            contToken = req.headers['continuationtoken']
            if (contToken < 10) {
                var headers = {
                    'continuationtoken': ++contToken,
                };
                res.set(headers).status(200).json({ "value" : [ {"properties":{"id": contToken, "name": "Product" }}] });
            } else {
                res.status(200).json({"value": [ {"properties":{"id" : contToken, "name": "product"}} ]});
            }

        } else {
            console.log('first')
            var headers = {
                'continuationtoken': 2,
            };
            res.set(headers).status(200).json({ "value" : [ {"properties":{"id": 1, "name": "Product" }}] });
        }

    });
};

pagingSpecial.prototype.router = router;

module.exports = pagingSpecial;
