var express = require('express');
var router = express.Router();
var utils = require('../util/utils')

// valid enums
var tommy = {
    "DaysOfWeek":"Monday",
    "IntEnum":"1",
    "name":"Tommy Tomson"
};

// unexpected enum
var casper = {
    "DaysOfWeek":"Weekend",
    "IntEnum":"2",
    "name":"Casper Ghosty"
};

// enum from allowed values
var scooby = {
    "DaysOfWeek":"Thursday",
    "IntEnum":"2.1",
    "name":"Scooby Scarface"
};

var pathitem = function(coverage) {
    router.get('/pet/:petId', function(req, res, next) {
        var petId = req.params.petId;
        console.log('Inside pathItem handler with petId "' + petId +'"\n');
        if (petId === 'tommy') {
            coverage['expectedEnum']++;
            res.status(200).send(JSON.stringify(tommy));
        } 
        else if(petId === 'casper'){
            res.status(200).send(JSON.stringify(casper));
            coverage['unexpectedEnum']++;
        }
        else if(petId === 'scooby'){
            res.status(200).send(JSON.stringify(scooby));
            coverage['allowedValueEnum']++;
        }
        else{
            utils.send400(res, next, 'Pet not found for '+petId);
        }
    });
}

pathitem.prototype.router = router;

module.exports = pathitem;