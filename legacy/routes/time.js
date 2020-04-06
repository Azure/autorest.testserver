var express = require('express');
var router = express.Router();
var utils = require('../util/utils')

var time = function(coverage) {
    coverage['BodyTimeGet'] = 0;
    coverage['BodyTimePut'] = 0;

    router.put('/put', function(req, res, next) {
        let body = req.body;
        if (body == '08:07:56') {
            coverage['BodyTimePut']++;
            res.status(200).json("Nice job posting time");
        }
        else{
            utils.send400(res, next, 'Did not receive what I was expecting');
        }
    });
    router.get('/get', function(req, res, next) {
        coverage['BodyTimeGet']++;
        res.status(200).type('json').end('"11:34:56"');
    });
}

time.prototype.router = router;

module.exports = time;
