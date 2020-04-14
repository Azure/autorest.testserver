var express = require('express');
var router = express.Router();
var utils = require('../util/utils');
var _ = require('underscore');

var multipleInheritance = function(coverage) {
    coverage['MultipleInheritancePetGet'] = 0;
    coverage['MultipleInheritancePetPut'] = 0;
    coverage['MultipleInheritanceHorseGet'] = 0;
    coverage['MultipleInheritanceHorsePut'] = 0;
    coverage['MultipleInheritanceFelineGet'] = 0;
    coverage['MultipleInheritanceFelinePut'] = 0;
    coverage['MultipleInheritanceCatGet'] = 0;
    coverage['MultipleInheritanceCatPut'] = 0;
    coverage['MultipleInheritanceKittenGet'] = 0;
    coverage['MultipleInheritanceKittenPut'] = 0;

    // Pet get and put
    router.get('/pet', function(req, res, next) {
        coverage['MultipleInheritancePetGet']++;
        res.status(200).type('json').end('{ "name": "Peanut" }');
    });

    router.put('/pet', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Butter" })) {
            coverage['MultipleInheritancePetPut']++;
            res.status(200).json("Pet was correct!");
        } else {
            utils.send400(res, next, "Pet was incorrect :'(");
        }
    });

    // Horse get and put
    router.get('/horse', function(req, res, next) {
        coverage['MultipleInheritanceHorseGet']++;
        res.status(200).type('json').end('{ "name": "Fred", "isAShowHorse": true }');
    });

    router.put('/horse', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "General", "isAShowHorse": false })) {
            coverage['MultipleInheritanceHorsePut']++;
            res.status(200).json("Horse was correct!");
        } else {
            utils.send400(res, next, "Horse was incorrect :'(");
        }
    });

    // Feline get and put
    router.get('/feline', function(req, res, next) {
        coverage['MultipleInheritanceFelineGet']++;
        res.status(200).type('json').end('{ "meows": true, "hisses": true }');
    });

    router.put('/feline', function (req, res, next) {
        if (_.isEqual(req.body, { "meows": false, "hisses": true })) {
            coverage['MultipleInheritanceFelinePut']++;
            res.status(200).json("Feline was correct!");
        } else {
            utils.send400(res, next, "Feline was incorrect :'(");
        }
    });

    // Cat get and put
    router.get('/cat', function(req, res, next) {
        coverage['MultipleInheritanceCatGet']++;
        res.status(200).type('json').end('{ "name": "Whiskers", "likesMilk": true, "meows": true, "hisses": true }');
    });

    router.put('/cat', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Boots", "likesMilk": false, "meows": true, "hisses": false })) {
            coverage['MultipleInheritanceCatPut']++;
            res.status(200).json("Cat was correct!");
        } else {
            utils.send400(res, next, "Cat was incorrect :'(");
        }
    });

    // Kitten get and put
    router.get('/kitten', function(req, res, next) {
        coverage['MultipleInheritanceKittenGet']++;
        res.status(200).type('json').end('{ "name": "Gatito", "likesMilk": true, "meows": true, "hisses": true, "eatsMiceYet": false }');
    });

    router.put('/kitten', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Kitty", "likesMilk": false, "meows": true, "hisses": false, "eatsMiceYet": true })) {
            coverage['MultipleInheritanceKittenPut']++;
            res.status(200).json("Kitten was correct!");
        } else {
            utils.send400(res, next, "Kitten was incorrect :'(");
        }
    });
}

multipleInheritance.prototype.router = router;

module.exports = multipleInheritance;