const express = require('express');
const router = express.Router();
const util = require('util');
const { writeFileSync, unlinkSync } = require("fs");

const report = function(coverage, azureCoverage, optionalCoverage) {

  const writeOutCoverageReport = (path, object) => {
    try {
      require("fs").writeFileSync(
        require("path").join(__dirname, path),
        JSON.stringify(object, null, 2));
    } catch (_) { }
  };

  const getQualifiedSuffix = (req) => {
    let qualifier = (req.query || {}).qualifier;
    if (typeof qualifier !== "string") qualifier = "";
    if (qualifier.length > 0 && !qualifier.startsWith(".")) qualifier = "." + qualifier;
    return qualifier + ".json";
  }

  router.get('/', function(req, res, next) {
    writeOutCoverageReport(`../coverage/report-vanilla${getQualifiedSuffix(req)}`, coverage);
    res.status(200).json(coverage);
  });

  router.get('/azure', function(req, res, next) {
    writeOutCoverageReport(`../coverage/report-azure${getQualifiedSuffix(req)}`, azureCoverage);
    res.status(200).json(azureCoverage);
  });

  router.get('/optional', function(req, res, next) {
    writeOutCoverageReport(`../coverage/report-optional${getQualifiedSuffix(req)}`, optionalCoverage);
    res.status(200).json(optionalCoverage);
  });

  router.post("/clear", function(req, res, next) {
    Object.getOwnPropertyNames(coverage).forEach(function(val, idx, array) {
      coverage[val] = 0;
    });
    Object.getOwnPropertyNames(azureCoverage).forEach(function(val, idx, array) {
      azureCoverage[val] = 0;
    });
    Object.getOwnPropertyNames(coverage).forEach(function(val, idx, array) {
      optionalCoverage[val] = 0;
    });
    res.status(200).send().end();
});
}

report.prototype.router = router;

module.exports = report;
