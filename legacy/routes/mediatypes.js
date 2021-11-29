var express = require("express");
var router = express.Router();
var utils = require("../util/utils");

var mediatypes = function (coverage) {
  coverage["MediaTypeJson"] = 0;
  coverage["MediaTypePdf"] = 0;
  coverage["MediaTypeWithEncoding"] = 0;

  router.post("/analyze", function (req, res, next) {
    let content_type = req.headers["content-type"];
    let body = req.body;
    console.log("Content-Type: " + content_type);
    console.log("Body: " + body);

    // JSON will expect to find a 'source' key
    if (content_type === "application/json" && "source" in body) {
      coverage["MediaTypeJson"]++;
      res.status(200).json("Nice job with JSON");
    }
    // PDF will expect to see the 3 bytes PDF
    else if (content_type === "application/pdf" && body === "PDF") {
      coverage["MediaTypePdf"]++;
      res.status(200).json("Nice job with PDF");
    } else {
      utils.send400(res, next, "Did not received what I was expecting");
    }
  });
  router.post("/contentTypeWithEncoding", function (req, res, next) {
    let content_type = req.headers["content-type"];
    if (content_type === "text/plain; charset=UTF-8") {
      coverage["MediaTypeWithEncoding"]++;
      res.status(200).json("Nice job sending content type with encoding");
    } else {
      utils.send400(res, next, "Did not receive what I was expecting");
    }
  });
};

mediatypes.prototype.router = router;

module.exports = mediatypes;
