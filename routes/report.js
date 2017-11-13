var express = require('express');
var router = express.Router();
var util = require('util');

var report = function(coverage, azureCoverage, optionalCoverage) {

  const writeOutCoverageReport = () => require("fs").writeFileSync(
    require("path").join(__dirname, "../report.json"), 
    JSON.stringify({ 'vanilla': coverage, 'azure': azurecoverage, 'optional': optionalCoverage }));

  router.get('/', function(req, res, next) {
    writeOutCoverageReport();
    res.status(200).end(JSON.stringify(coverage));
  });

  router.get('/azure', function(req, res, next) {
    writeOutCoverageReport();
    res.status(200).end(JSON.stringify(azureCoverage));
  });
}

report.prototype.router = router;

module.exports = report;
