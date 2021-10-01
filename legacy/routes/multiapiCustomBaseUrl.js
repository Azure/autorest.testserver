var express = require("express");
var router = express.Router();
var utils = require("../util/utils");

var multiapiCustomBaseUrl = function (optionalCoverage) {
  optionalCoverage["MultiapiCustomBaseUrlApiVersionOne"] = 0;
  optionalCoverage["MultiapiCustomBaseUrlApiVersionTwo"] = 0;

  router.put("/v1/test", function (req, res, next) {
    if (req.query["api-version"] === "1.0.0" && req.query["id"] == 1) {
      optionalCoverage["MultiapiCustomBaseUrlApiVersionOne"]++;
      res.status(200).end();
    } else {
      utils.send400(res, next, "Api version needs to be 1.0.0 and you should pass in 1 for 'id'");
    }
  });

  router.put("/v2/test", function (req, res, next) {
    if (req.query["api-version"] === "2.0.0" && req.query["id"] == 2) {
      optionalCoverage["MultiapiCustomBaseUrlApiVersionTwo"]++;
      res.status(200).type("json").end();
    } else {
      utils.send400(res, next, "Api version needs to be 2.0.0 and you should pass in 2 for 'id'");
    }
  });
};

multiapiCustomBaseUrl.prototype.router = router;

module.exports = multiapiCustomBaseUrl;
