import { request } from "express";
import { app, json } from "../api";

app.category("azure", () => {
  app.get("/paging/multiple/duplicateParams/:pagenumber", "PagingDuplicateParameters", (req) => {
    if (req.params.pagenumber === "1") {
      return {
        status: 200,
        body: json({
          values: [{ properties: { id: 1, name: "Product" } }],
          nextLink: req.baseUrl + "/paging/multiple/duplicateParams/2?%24filter=serviceReturned&%24skiptoken=bar",
        }),
      };
    } else if (req.params.pagenumber === "2") {
      req.expect.deepEqual("serviceReturned", req.query["$filter"]);
      req.expect.deepEqual("bar", req.query["$skiptoken"]);
      return {
        status: 200,
        body: json({
          values: [],
        }),
      };
    } else {
      return {
        status: 400,
        body: json("Wrong page number. Should only be 1 or 2."),
      };
    }
  });
  app.get("/paging/apiVersion/append/:pagenumber", "PagingWithApiVersionAppend", (req) => {
    if (req.params.pagenumber === "1") {
      return {
        status: 200,
        body: json({
          values: [{ properties: { id: 1, name: "Product" } }],
          nextLink: req.baseUrl + "/paging/apiVersion/append/2?%24skiptoken=bar",
        }),
      };
    } else if (req.params.pagenumber === "2") {
      req.expect.containsQueryParam("api-version", "1.0.0");
      req.expect.containsQueryParam("$skiptoken", "bar");
      return {
        status: 200,
        body: json({
          values: [],
        }),
      };
    } else {
      return {
        status: 400,
        body: json("Wrong page number. Should only be 1 or 2"),
      };
    }
  });
  app.get("/paging/apiVersion/replace/:pagenumber", "PagingWithApiVersionReplace", (req) => {
    if (req.params.pagenumber === "1") {
      return {
        status: 200,
        body: json({
          values: [{ properties: { id: 1, name: "Product" } }],
          nextLink: req.baseUrl + "/paging/apiVersion/replace/2?Api-Version=notMe&%24skiptoken=bar",
        }),
      };
    } else if (req.params.pagenumber === "2") {
      req.expect.containsQueryParam("api-version", "1.0.0");
      req.expect.containsQueryParam("$skiptoken", "bar");
      return {
        status: 200,
        body: json({
          values: [],
        }),
      };
    } else {
      return {
        status: 400,
        body: json("Wrong page number. Should only be 1 or 2"),
      };
    }
  });
});

app.category("optional", () => {
  app.get("/paging/maxPageSize", "PagingDontSendMaxPageSize", (req) => {
    if (req.query["$maxpagesize"] !== undefined) {
      return {
        status: 400,
        body: json("Should not send maxpagesize."),
      };
    }
    return {
      status: 200,
      body: json({
        values: [],
      }),
    };
  });
});
