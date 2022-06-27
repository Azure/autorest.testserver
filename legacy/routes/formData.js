// @ts-check
var express = require("express");
var router = express.Router();
var busboy = require("busboy");

var formData = function (coverage) {
  coverage["FormdataStreamUploadFile"] = 0;
  router.post("/stream/uploadfile", function (req, res, next) {
    var bb = busboy({ headers: req.headers });
    bb.on("file", function (fieldname, file, filename, encoding, mimetype) {
      console.log(
        "File [" + fieldname + "]: filename: " + filename + ", encoding: " + encoding + ", mimetype: " + mimetype,
      );
      file.pipe(res);
      coverage["FormdataStreamUploadFile"]++;
    });
    bb.on("field", function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log("Field [" + fieldname + "]: value: " + val);
      if (fieldname === "fileContent") {
        coverage["FormdataStreamUploadFile"]++;
        res.send(val);
      }
    });
    bb.on("close", function () {
      console.log("Done parsing form!");
      res.send();
    });

    req.pipe(bb);
  });
};

formData.prototype.router = router;

module.exports = formData;
