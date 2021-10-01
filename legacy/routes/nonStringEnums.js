var express = require("express");
var router = express.Router();
var utils = require("../util/utils");

var nonStringEnums = function (coverage) {
  coverage["NonStringEnumsPostInt"] = 0;
  coverage["NonStringEnumsGetInt"] = 0;
  coverage["NonStringEnumsPostFloat"] = 0;
  coverage["NonStringEnumsGetFloat"] = 0;

  router.put("/int/put", function (req, res, next) {
    let body = req.body;
    if (body == "200") {
      coverage["NonStringEnumsPostInt"]++;
      res.status(200).json("Nice job posting an int enum");
    } else {
      utils.send400(res, next, "Did not receive what I was expecting");
    }
  });
  router.get("/int/get", function (req, res, next) {
    coverage["NonStringEnumsGetInt"]++;
    res.status(200).type("json").end("429");
  });
  router.put("/float/put", function (req, res, next) {
    let body = req.body;
    if (body == "200.4") {
      coverage["NonStringEnumsPostFloat"]++;
      res.status(200).json("Nice job posting a float enum");
    } else {
      utils.send400(res, next, "Did not receive what I was expecting");
    }
  });
  router.get("/float/get", function (req, res, next) {
    coverage["NonStringEnumsGetFloat"]++;
    res.status(200).type("json").end("429.1");
  });
};

nonStringEnums.prototype.router = router;

module.exports = nonStringEnums;
