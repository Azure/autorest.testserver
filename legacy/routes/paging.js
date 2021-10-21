var express = require("express");
var router = express.Router();
var util = require("util");
var utils = require("../util/utils");

const getRequestBaseUrl = (request) => `${request.protocol}://${request.get("host")}`;

var hasScenarioCookie = function (req, scenario) {
  var cookies = req.headers["cookie"];
  var cookieMatch;
  if (cookies) {
    cookieMatch = /scenario=(\w+)/.exec(cookies);
    if (cookieMatch && cookieMatch[1] && cookieMatch[1] === scenario) {
      return true;
    }
  }

  return false;
};

var addScenarioCookie = function (res, scenario) {
  res.cookie("scenario", scenario, {
    maxAge: 900000,
  });
  return res;
};

var removeScenarioCookie = function (res) {
  res.clearCookie("scenario");
  return res;
};

var paging = function (coverage) {
  coverage["PagingNoItemName"] = 0;
  coverage["PagingNextLinkNameNull"] = 0;
  coverage["PagingSingle"] = 0;
  coverage["PagingMultiple"] = 0;
  coverage["PagingMultipleWithQueryParameters"] = 0;
  coverage["PagingOdataMultiple"] = 0;
  coverage["PagingMultiplePath"] = 0;
  coverage["PagingMultipleRetryFirst"] = 0;
  coverage["PagingMultipleRetrySecond"] = 0;
  coverage["PagingSingleFailure"] = 0;
  coverage["PagingMultipleFailure"] = 0;
  coverage["PagingMultipleFailureUri"] = 0;
  coverage["PagingFragment"] = 0;
  coverage["PagingMultipleLRO"] = 0;
  coverage["PagingCustomUrlPartialNextLink"] = 0;
  coverage["PagingCustomUrlPartialOperationNextLink"] = 0;
  coverage["PagingReturnModelWithXMSClientName"] = 0;
  coverage["PagingFirstResponseEmpty"] = 0;

  router.get("/noitemname", function (req, res, next) {
    coverage["PagingNoItemName"]++;
    res.status(200).json({ value: [{ properties: { id: 1, name: "Product" } }] });
  });

  router.get("/nullnextlink", function (req, res, next) {
    coverage["PagingNextLinkNameNull"]++;
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: getRequestBaseUrl(req) + "/paging/idontexistraise404",
    });
  });

  router.get("/single", function (req, res, next) {
    coverage["PagingSingle"]++;
    res.status(200).json({ values: [{ properties: { id: 1, name: "Product" } }] });
  });

  router.get("/multiple", function (req, res, next) {
    coverage["PagingMultiple"]++;
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: getRequestBaseUrl(req) + "/paging/multiple/page/2",
    });
  });

  router.get("/multiple/getWithQueryParams", function (req, res, next) {
    // No coverage added here, gets added in next operation nextOperationWithQueryParams
    if (req.query["requiredQueryParameter"] == "100" && req.query["queryConstant"] == "true") {
      res.status(200).json({
        values: [{ properties: { id: 1, name: "Product" } }],
        nextLink: getRequestBaseUrl(req) + "/paging/multiple/nextOperationWithQueryParams",
      });
    } else {
      utils.send400(res, next, "The query parameters to getWithQueryParams were not passed correctly");
    }
  });

  router.get("/multiple/nextOperationWithQueryParams", function (req, res, next) {
    if (Object.keys(req.query).length <= 1 && req.query["queryConstant"] === "true") {
      coverage["PagingMultipleWithQueryParameters"]++;
      res.status(200).json({ values: [{ properties: { id: 2, name: "Product" } }] });
    } else {
      utils.send400(res, next, "The query parameters to nextOperationWithQueryParams were not passed correctly");
    }
  });

  router.get("/multiple/page/:pagenumber", function (req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).json({
        values: [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }],
        nextLink: getRequestBaseUrl(req) + "/paging/multiple/page/" + ++req.params.pagenumber,
      });
    } else {
      res.status(200).json({ values: [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }] });
    }
  });

  router.get("/multiple/odata", function (req, res, next) {
    coverage["PagingOdataMultiple"]++;
    res.status(200).json({
      "values": [{ properties: { id: 1, name: "Product" } }],
      "odata.nextLink": getRequestBaseUrl(req) + "/paging/multiple/odata/page/2",
    });
  });

  router.get("/multiple/odata/page/:pagenumber", function (req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).json({
        "values": [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }],
        "odata.nextLink": getRequestBaseUrl(req) + "/paging/multiple/odata/page/" + ++req.params.pagenumber,
      });
    } else {
      res.status(200).json({ values: [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }] });
    }
  });

  router.get("/multiple/withpath/:offset", function (req, res, next) {
    coverage["PagingMultiplePath"]++;
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: getRequestBaseUrl(req) + "/paging/multiple/withpath/page/" + req.params.offset + "/2",
    });
  });

  router.get("/multiple/withpath/page/:offset/:pagenumber", function (req, res, next) {
    if (req.params.pagenumber < 10) {
      res.status(200).json({
        values: [
          { properties: { id: parseInt(req.params.pagenumber) + parseInt(req.params.offset), name: "product" } },
        ],
        nextLink:
          getRequestBaseUrl(req) +
          "/paging/multiple/withpath/page/" +
          req.params.offset +
          "/" +
          ++req.params.pagenumber,
      });
    } else {
      res.status(200).json({
        values: [
          { properties: { id: parseInt(req.params.pagenumber) + parseInt(req.params.offset), name: "product" } },
        ],
      });
    }
  });

  router.get("/multiple/retryfirst", function (req, res, next) {
    var scenario = "PagingMultipleRetryFirst";
    if (!hasScenarioCookie(req, scenario)) {
      addScenarioCookie(res, scenario);
      res.status(500).end();
    } else {
      coverage[scenario]++;
      removeScenarioCookie(res);
      res.status(200).json({
        values: [{ properties: { id: 1, name: "Product" } }],
        nextLink: getRequestBaseUrl(req) + "/paging/multiple/page/2",
      });
    }
  });

  router.get("/multiple/retrysecond", function (req, res, next) {
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: getRequestBaseUrl(req) + "/paging/multiple/retrysecond/page/2",
    });
  });

  router.get("/multiple/retrysecond/page/:pagenumber", function (req, res, next) {
    var scenario = "PagingMultipleRetrySecond";
    if (req.params.pagenumber === "2") {
      if (!hasScenarioCookie(req, scenario)) {
        addScenarioCookie(res, scenario);
        res.status(500).end();
      } else {
        coverage[scenario]++;
        removeScenarioCookie(res);
        res.status(200).json({
          values: [{ properties: { id: 1, name: "Product" } }],
          nextLink: getRequestBaseUrl(req) + "/paging/multiple/retrysecond/page/3",
        });
      }
    } else if (req.params.pagenumber < 10) {
      res.status(200).json({
        values: [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }],
        nextLink: getRequestBaseUrl(req) + "/paging/multiple/retrysecond/page/" + ++req.params.pagenumber,
      });
    } else {
      res.status(200).json({ values: [{ properties: { id: parseInt(req.params.pagenumber), name: "product" } }] });
    }
  });

  router.get("/multiple/fragment/:tenant", function (req, res, next) {
    if (req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    } else {
      res.status(200).json({ "values": [{ properties: { id: 1, name: "product" } }], "odata.nextLink": "next?page=2" });
    }
  });

  router.get("/multiple/fragment/:tenant/next", function (req, res, next) {
    if (req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    } else if (req.query.page < 10) {
      res.status(200).json({
        "values": [{ properties: { id: parseInt(req.query.page), name: "product" } }],
        "odata.nextLink": "next?page=" + ++req.query.page,
      });
    } else {
      coverage["PagingFragment"]++;
      res.status(200).json({ values: [{ properties: { id: parseInt(req.query.page), name: "product" } }] });
    }
  });

  router.get("/multiple/fragmentwithgrouping/:tenant", function (req, res, next) {
    if (req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    } else {
      res.status(200).json({ "values": [{ properties: { id: 1, name: "product" } }], "odata.nextLink": "next?page=2" });
    }
  });

  router.get("/multiple/fragmentwithgrouping/:tenant/next", function (req, res, next) {
    if (req.query.api_version != "1.6" || req.params.tenant != "test_user") {
      res.status(400).end("Required path and query parameters are not present");
    } else if (req.query.page < 10) {
      res.status(200).json({
        "values": [{ properties: { id: parseInt(req.query.page), name: "product" } }],
        "odata.nextLink": "next?page=" + ++req.query.page,
      });
    } else {
      res.status(200).json({ values: [{ properties: { id: parseInt(req.query.page), name: "product" } }] });
    }
  });

  router.get("/itemNameWithXMSClientName", function (req, res, next) {
    coverage["PagingReturnModelWithXMSClientName"]++;
    res.status(200).json({ values: [{ properties: { id: 1, name: "Product" } }] });
  });

  router.get("/firstResponseEmpty/:pagenumber", function (req, res, next) {
    if (req.params.pagenumber == 1) {
      res.status(200).json({ value: [], nextLink: "/paging/firstResponseEmpty/2" });
    } else if (req.params.pagenumber == 2) {
      coverage["PagingFirstResponseEmpty"]++;
      res.status(200).json({ value: [{ properties: { id: 1, name: "Product" } }] });
    } else {
      res
        .status(400)
        .end(
          "Incorrect page number " +
            req.params.pagenumber +
            ". Needs to be either 1 for the initial call, or 2 for the final call",
        );
    }
  });

  /*** PAGEABLE LROs ***/
  router.post("/multiple/lro", function (req, res, next) {
    var pollingUri = getRequestBaseUrl(req) + "/paging/multiple/lro/200";
    var headers = {
      "Azure-AsyncOperation": pollingUri,
      "Location": getRequestBaseUrl(req) + "/paging/multiple",
      "Retry-After": 0,
    };
    res.set(headers).status(202).json({ status: "Accepted" });
  });

  router.get("/multiple/lro/200", function (req, res, next) {
    coverage["PagingMultipleLRO"]++;
    res.status(200).json({ status: "Succeeded" });
  });

  /*** NEGATIVE TESTS HERE ***/
  router.get("/single/failure", function (req, res, next) {
    coverage["PagingSingleFailure"]++;
    res.status(400).json({ status: 400, message: "Expected single failure test." });
  });

  router.get("/multiple/failure", function (req, res, next) {
    coverage["PagingMultipleFailure"]++;
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: getRequestBaseUrl(req) + "/paging/multiple/failure/page/2",
    });
  });

  router.get("/multiple/failure/page/:pagenumber", function (req, res, next) {
    res.status(400).json({ status: 400, message: "Expected single failure test." });
  });

  router.get("/multiple/failureuri", function (req, res, next) {
    coverage["PagingMultipleFailureUri"]++;
    res.status(200).json({ values: [{ properties: { id: 1, name: "Product" } }], nextLink: "*&*#&$" });
  });

  /** CUSTOM URL **/
  router.get("/customurl/partialnextlink", function (req, res, next) {
    res.status(200).json({
      values: [{ properties: { id: 1, name: "Product" } }],
      nextLink: "/paging/customurl/partialnextlink/page/2",
    });
  });

  router.get("/customurl/partialnextlink/page/2", function (req, res, next) {
    coverage["PagingCustomUrlPartialNextLink"]++;
    res.status(200).json({ values: [{ properties: { id: 2, name: "Product" } }] });
  });

  router.get("/customurl/partialnextlinkop", function (req, res, next) {
    res
      .status(200)
      .json({ values: [{ properties: { id: 1, name: "Product" } }], nextLink: "partialnextlinkop/page/2" });
  });

  router.get("/customurl/partialnextlinkop/page/2", function (req, res, next) {
    coverage["PagingCustomUrlPartialOperationNextLink"]++;
    res.status(200).json({ values: [{ properties: { id: 2, name: "Product" } }] });
  });
};

paging.prototype.router = router;

module.exports = paging;
