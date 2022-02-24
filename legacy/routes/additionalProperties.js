var express = require("express");
var router = express.Router();
var util = require("util");
var _ = require("underscore");
var utils = require("../util/utils");

var apTrue = {
  id: 1,
  name: "Puppy",
  birthdate: "2017-12-13T02:29:51Z",
  complexProperty: {
    color: "Red",
  },
};

var apSubclass = {
  id: 1,
  name: "Lisa",
  friendly: true,
  birthdate: "2017-12-13T02:29:51Z",
  complexProperty: {
    color: "Red",
  },
};

var apObject = {
  id: 2,
  name: "Hira",
  siblings: [
    {
      id: 1,
      name: "Puppy",
      birthdate: "2017-12-13T02:29:51Z",
      complexProperty: {
        color: "Red",
      },
    },
  ],
  picture: new Buffer([255, 255, 255, 255, 254]).toString("base64"),
};

var apString = {
  id: 3,
  name: "Tommy",
  color: "red",
  weight: "10 kg",
  city: "Bombay",
};

var apInProperties = {
  id: 4,
  name: "Bunny",
  additionalProperties: {
    height: 5.61,
    weight: 599,
    footsize: 11.5,
  },
};

var apInPropertiesWithAPString = {
  "id": 5,
  "name": "Funny",
  "@odata.location": "westus",
  "additionalProperties": {
    height: 5.61,
    weight: 599,
    footsize: 11.5,
  },
  "color": "red",
  "city": "Seattle",
  "food": "tikka masala",
};

var additionalProperties = function (coverage) {
  router.put("/true", function (req, res, next) {
    if (req.body && _.isEqual(utils.coerceDate(req.body), apTrue)) {
      coverage["additionalPropertiesTrue"]++;
      let resBody = JSON.parse(JSON.stringify(apTrue));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
  router.put("/true-subclass", function (req, res) {
    if (req.body && _.isEqual(utils.coerceDate(req.body), apSubclass)) {
      coverage["additionalPropertiesSubclass"]++;
      let resBody = JSON.parse(JSON.stringify(apSubclass));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
  router.put("/type/object", function (req, res, next) {
    if (req.body && _.isEqual(utils.coerceDate(req.body), apObject)) {
      coverage["additionalPropertiesTypeObject"]++;
      let resBody = JSON.parse(JSON.stringify(apObject));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
  router.put("/type/string", function (req, res, next) {
    if (req.body && _.isEqual(utils.coerceDate(req.body), apString)) {
      coverage["additionalPropertiesTypeString"]++;
      let resBody = JSON.parse(JSON.stringify(apString));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
  router.put("/in/properties", function (req, res, next) {
    if (req.body && _.isEqual(req.body, apInProperties)) {
      coverage["additionalPropertiesInProperties"]++;
      let resBody = JSON.parse(JSON.stringify(apInProperties));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
  router.put("/in/properties/with/additionalProperties/string", function (req, res, next) {
    if (req.body && _.isEqual(req.body, apInPropertiesWithAPString)) {
      coverage["additionalPropertiesInPropertiesWithAPTypeString"]++;
      let resBody = JSON.parse(JSON.stringify(apInPropertiesWithAPString));
      resBody.status = true;
      res.status(200).json(resBody);
    } else {
      utils.send400(res, next, "Did not like additionalProperties req " + util.inspect(req.body));
    }
  });
};

additionalProperties.prototype.router = router;

module.exports = additionalProperties;
