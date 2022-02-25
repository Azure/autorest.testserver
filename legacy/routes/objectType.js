var express = require("express");
var router = express.Router();
var utils = require("../util/utils");
var _ = require("underscore");

var objectType = function (coverage) {
  coverage["ObjectTypeResponse"] = 0;
  coverage["ObjectTypePut"] = 0;
  coverage["ObjectTypeErrorResponse"] = 0;

  router.get("/get", function (req, res, next) {
    coverage["ObjectTypeResponse"]++;
    res.status(200).type("json").end('{ "message": "An object was successfully returned" }');
  });

  router.put("/put", function (req, res, next) {
    let body = req.body;
    console.log("Body: " + body);

    if (_.isEqual(body, { foo: "bar" })) {
      coverage["ObjectTypePut"]++;
      res.status(200).end();
    } else {
      coverage["ObjectTypeErrorResponse"]++;
      res.status(400).type("json").end('{ "message": "The object you passed was incorrect" }');
    }
  });
};
objectType.prototype.router = router;

module.exports = objectType;
