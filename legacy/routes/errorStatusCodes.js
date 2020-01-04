var express = require('express');
var router = express.Router();
var utils = require('../util/utils')

// valid Pet
var tommyPet = {
    "name":"Tommy Tomson",
    "aniType":"Dog"
};

// unexpected enum
var sadCasper = {
    "actionResponse":"grrrr",
    "errorType":"PetSadError",
    "errorMessage":"casper aint happy",
    "reason":"need more treats"
};

// enum from allowed values
var hungryScooby = {
    "actionResponse":"howl",
    "errorType":"PetHungryOrThirstyError",
    "errorMessage":"scooby is low",
    "reason":"need more everything",
    "hungryOrThirsty":"hungry and thirsty"
};

var stringError = " is missing";

var intError = 123;

var linkNotFoundError = {
    "someBaseProp":"problem finding pet",
    "reason":"link to pet not found",
    "whatSubAddress":"pet/yourpet was not found",
    "whatNotFound":"InvalidResourceLink"
};

var animalNotFoundError = {
    "someBaseProp":"problem finding animal",
    "reason":"the type of animal requested is not available",
    "name":"coyote",
    "whatNotFound":"AnimalNotFound"
};


var pathitem = function(coverage) {
    router.post('/Pets/doSomething/:whatAction', function(req, res, next) {
        var whatAction = req.params.whatAction;
        console.log('Inside action: "' + whatAction +'"\n');
        if (whatAction === 'stay') {
            coverage['expectedNoErrors']++;
            res.status(200).end(JSON.stringify(tommyPet));
        }
        else if(whatAction === 'jump'){
            res.status(500).end(JSON.stringify(sadCasper));
            coverage['expectedPetSadError']++;
        }
        else if(whatAction === 'fetch'){
            res.status(404).end(JSON.stringify(hungryScooby));
            coverage['expectedPetHungryError']++;
        }
        else{
            utils.send400(res, next, 'Action cannot be performed '+whatAction);
        }
    });

    router.get('/Pets/:petId/GetPet', function(req, res, next) {
        var petId = req.params.petId;
        console.log('Inside petfinder for '+petId+'\n');
        if (petId === 'tommy') {
            coverage['expectedNoErrors']++;
            res.status(200).end(JSON.stringify(tommyPet));
        }
        else if(petId === 'django') {
            res.status(202).end();
        }
        else if(petId === 'coyoteUgly'){
            coverage['animalNotFoundError']++;
            res.status(404).end(JSON.stringify(animalNotFoundError));
        }
        else if(petId === 'weirdAlYankovic'){
            coverage['linkNotFoundError']++;
            res.status(404).end(JSON.stringify(linkNotFoundError));
        }
        else if(petId === 'ringo'){
            coverage['stringError']++;
            res.status(400).end(JSON.stringify(petId+stringError));
        }
        else if(petId === 'alien123'){
            coverage['intError']++;
            res.status(501).end(JSON.stringify(intError));
        }
        else {
            res.status(402).end("That's all folks!!");
        }
    });
}

pathitem.prototype.router = router;

module.exports = pathitem;