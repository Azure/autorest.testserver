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

  router.get('/', function(req, res, next) {
    writeOutCoverageReport("../report-vanilla.json", coverage);
    res.status(200).end(JSON.stringify(coverage));
  });

  router.get('/azure', function(req, res, next) {
    writeOutCoverageReport("../report-azure.json", azureCoverage);
    res.status(200).end(JSON.stringify(azureCoverage));
  });
}

report.prototype.router = router;

module.exports = report;
