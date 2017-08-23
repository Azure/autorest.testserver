var express = require('express');
var router = express.Router();
var util = require('util');
var utils = require('../util/utils');

var hasScenarioCookie = function(req, scenario) {
  var cookies = req.headers['cookie'];
  var cookieMatch;
  if (cookies) {
    cookieMatch = /scenario=(\w+)/.exec(cookies);
    if (cookieMatch && cookieMatch[1] && cookieMatch[1] === scenario) {
      return true;
    }
  }

  return false;
};

var addScenarioCookie = function(res, scenario) {
  res.cookie('scenario', scenario, {
    'maxAge': 900000
  });
  return res;
};

var removeScenarioCookie = function(res) {
  res.clearCookie('scenario');
  return res;
}

var paging = function(coverage) {
  coverage['PagingSingle'] = 0;
  coverage['PagingMultiple'] = 0;
  coverage['PagingOdataMultiple'] = 0;
  coverage['PagingMultiplePath'] = 0;
  coverage['PagingMultipleRetryFirst'] = 0;
  coverage['PagingMultipleRetrySecond'] = 0;
  coverage['PagingSingleFailure'] = 0;
  coverage['PagingMultipleFailure'] = 0;
  coverage['PagingMultipleFailureUri'] = 0;
  coverage['PagingFragment'] = 1;

  router.get('/single', function(req, res, next) {
    coverage["PagingSingle"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}]}');
  });

  router.get('/multiple', function(req, res, next) {
    
    coverage["PagingMultiple"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink":"' + 'http://localhost:' + utils.getPort() + '/paging/multiple/page/2" }')
  });

  router.get('/multiple/page/:pagenumber', function(req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/page/' + (++req.params.pagenumber) + '"}');
    } else {
      res.status(200).end('{"values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ]}');
    }
  });

  router.get('/multiple/odata', function(req, res, next) {
    
    coverage["PagingOdataMultiple"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "odata.nextLink":"' + 'http://localhost:' + utils.getPort() + '/paging/multiple/odata/page/2" }')
  });

  router.get('/multiple/odata/page/:pagenumber', function(req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ], "odata.nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/odata/page/' + (++req.params.pagenumber) + '"}');
    } else {
      res.status(200).end('{"values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ]}');
    }
  });

  router.get('/multiple/withpath/:offset', function(req, res, next) {
    
    coverage["PagingMultiplePath"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink":"' + 'http://localhost:' + utils.getPort() + '/paging/multiple/withpath/page/' + req.params.offset + '/2" }');
  });

  router.get('/multiple/withpath/page/:offset/:pagenumber', function(req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + (parseInt(req.params.pagenumber) + parseInt(req.params.offset)) + ', "name": "product"}} ], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/withpath/page/' + req.params.offset + "/" + (++req.params.pagenumber) + '"}');
    } else {
      res.status(200).end('{"values": [ {"properties":{"id" : ' + (parseInt(req.params.pagenumber) + parseInt(req.params.offset)) + ', "name": "product"}} ]}');
    }
  });

  router.get('/multiple/retryfirst', function(req, res, next) {
    var scenario = "PagingMultipleRetryFirst";
    if (!hasScenarioCookie(req, scenario)) {
      addScenarioCookie(res, scenario);
      res.status(500).end();
    } else {
      coverage[scenario]++;
      removeScenarioCookie(res);
      res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/page/2" }')
    }
  });

  router.get('/multiple/retrysecond', function(req, res, next) {
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/retrysecond/page/2" }')
  });

  router.get('/multiple/retrysecond/page/:pagenumber', function(req, res, next) {
    var scenario = "PagingMultipleRetrySecond";
    if (req.params.pagenumber === '2') {
      if (!hasScenarioCookie(req, scenario)) {
        addScenarioCookie(res, scenario);
        res.status(500).end();
      } else {
        coverage[scenario]++;
        removeScenarioCookie(res);
        res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/retrysecond/page/3" }')
      }
    } else if (req.params.pagenumber < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/retrysecond/page/' + (++req.params.pagenumber) + '"}');
    } else {
      res.status(200).end('{"values": [ {"properties":{"id" : ' + req.params.pagenumber + ', "name": "product"}} ]}');
    }
  });

  router.get('/multiple/fragment/:tenant', function(req, res, next) {
    if(req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    }
    else {
      res.status(200).end('{ "values": [ {"properties":{"id" : 1, "name": "product"}} ], "odata.nextLink": "next?page=2"}');
    }
  });

  router.get('/multiple/fragment/:tenant/next', function(req, res, next) {
    if(req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    }
    else if(req.query.page < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + req.query.page + ', "name": "product"}} ], "odata.nextLink": "next?page=' + ++req.query.page + '"}');
    }
    else {
      coverage["PagingFragment"]++;
      res.status(200).end('{"values": [ {"properties":{"id" : ' + req.query.page + ', "name": "product"}} ]}');
    }
  });

  router.get('/multiple/fragmentwithgrouping/:tenant', function(req, res, next) {
    if(req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    }
    else {
      res.status(200).end('{ "values": [ {"properties":{"id" : 1, "name": "product"}} ], "odata.nextLink": "next?page=2"}');
    }
  });

  router.get('/multiple/fragmentwithgrouping/:tenant/next', function(req, res, next) {
    if(req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    }
    else if(req.query.page < 10) {
      res.status(200).end('{ "values": [ {"properties":{"id" : ' + req.query.page + ', "name": "product"}} ], "odata.nextLink": "next?page=' + ++req.query.page + '"}');
    }
    else {
      res.status(200).end('{"values": [ {"properties":{"id" : ' + req.query.page + ', "name": "product"}} ]}');
    }
  });

  /*** NEGATIVE TESTS HERE ***/
  router.get('/single/failure', function(req, res, next) {
    coverage["PagingSingleFailure"]++;
    res.status(400).end('{"status": 400, "message": "Expected single failure test."}');
  });

  router.get('/multiple/failure', function(req, res, next) {
    coverage["PagingMultipleFailure"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink": "' + 'http://localhost:' + utils.getPort() + '/paging/multiple/failure/page/2" }')
  });

  router.get('/multiple/failure/page/:pagenumber', function(req, res, next) {
    res.status(400).end('{"status": 400, "message": "Expected single failure test."}');
  });

  router.get('/multiple/failureuri', function(req, res, next) {
    coverage["PagingMultipleFailureUri"]++;
    res.status(200).end('{ "values" : [ {"properties":{"id": 1, "name": "Product" }}], "nextLink": "*&*#&$" }')
  });


};

paging.prototype.router = router;

module.exports = paging;
