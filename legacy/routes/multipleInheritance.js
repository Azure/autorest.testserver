var express = require('express');
var router = express.Router();
var utils = require('../util/utils');
var _ = require('underscore');

var multipleInheritance = function(optionalCoverage) {
    optionalCoverage['MultipleInheritancePetGet'] = 0;
    optionalCoverage['MultipleInheritancePetPut'] = 0;
    optionalCoverage['MultipleInheritanceHorseGet'] = 0;
    optionalCoverage['MultipleInheritanceHorsePut'] = 0;
    optionalCoverage['MultipleInheritanceFelineGet'] = 0;
    optionalCoverage['MultipleInheritanceFelinePut'] = 0;
    optionalCoverage['MultipleInheritanceCatGet'] = 0;
    optionalCoverage['MultipleInheritanceCatPut'] = 0;
    optionalCoverage['MultipleInheritanceKittenGet'] = 0;
    optionalCoverage['MultipleInheritanceKittenPut'] = 0;

    // Pet get and put
    router.get('/pet', function(req, res, next) {
        optionalCoverage['MultipleInheritancePetGet']++;
        res.status(200).type('json').end('{ "name": "Peanut" }');
    });

    router.put('/pet', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Butter" })) {
            optionalCoverage['MultipleInheritancePetPut']++;
            res.status(200).json("Pet was correct!");
        } else {
            utils.send400(res, next, "Pet was incorrect :'(");
        }
    });

    // Horse get and put
    router.get('/horse', function(req, res, next) {
        optionalCoverage['MultipleInheritanceHorseGet']++;
        res.status(200).type('json').end('{ "name": "Fred", "isAShowHorse": true }');
    });

    router.put('/horse', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "General", "isAShowHorse": false })) {
            optionalCoverage['MultipleInheritanceHorsePut']++;
            res.status(200).json("Horse was correct!");
        } else {
            utils.send400(res, next, "Horse was incorrect :'(");
        }
    });

    // Feline get and put
    router.get('/feline', function(req, res, next) {
        optionalCoverage['MultipleInheritanceFelineGet']++;
        res.status(200).type('json').end('{ "meows": true, "hisses": true }');
    });

    router.put('/feline', function (req, res, next) {
        if (_.isEqual(req.body, { "meows": false, "hisses": true })) {
            optionalCoverage['MultipleInheritanceFelinePut']++;
            res.status(200).json("Feline was correct!");
        } else {
            utils.send400(res, next, "Feline was incorrect :'(");
        }
    });

    // Cat get and put
    router.get('/cat', function(req, res, next) {
        optionalCoverage['MultipleInheritanceCatGet']++;
        res.status(200).type('json').end('{ "name": "Whiskers", "likesMilk": true, "meows": true, "hisses": true }');
    });

    router.put('/cat', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Boots", "likesMilk": false, "meows": true, "hisses": false })) {
            optionalCoverage['MultipleInheritanceCatPut']++;
            res.status(200).json("Cat was correct!");
        } else {
            utils.send400(res, next, "Cat was incorrect :'(");
        }
    });

    // Kitten get and put
    router.get('/kitten', function(req, res, next) {
        optionalCoverage['MultipleInheritanceKittenGet']++;
        res.status(200).type('json').end('{ "name": "Gatito", "likesMilk": true, "meows": true, "hisses": true, "eatsMiceYet": false }');
    });

    router.put('/kitten', function (req, res, next) {
        if (_.isEqual(req.body, { "name": "Kitty", "likesMilk": false, "meows": true, "hisses": false, "eatsMiceYet": true })) {
            optionalCoverage['MultipleInheritanceKittenPut']++;
            res.status(200).json("Kitten was correct!");
        } else {
            utils.send400(res, next, "Kitten was incorrect :'(");
        }
    });
}

multipleInheritance.prototype.router = router;

module.exports = multipleInheritance;