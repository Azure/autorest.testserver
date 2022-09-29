import { app, json } from "../api";

app.category("optional", () => {
  app.get("/multiapi/paging/:pagenumber", "MultiapiPaging", (req) => {
    if (req.params.pagenumber === "1") {
      return {
        status: 200,
        body: json({ values: [{ optionalProperty: "paged" }], nextLink: req.baseUrl + "/multiapi/paging/2" }),
      };
    } else if (req.params.pagenumber === "2") {
      req.expect.containsQueryParam("api-version", "3.0.0");
      return {
        status: 200,
        body: json({ values: [{ optionalProperty: "paged" }] }),
      };
    } else {
      return {
        status: 400,
        body: json("Wrong page number. Should only be 1 or 2"),
      };
    }
  });

  app.get("/multiapi/one/paging/:pagenumber", "MultiapiOperationGroupPaging", (req) => {
    if (req.params.pagenumber === "1") {
      return {
        status: 200,
        body: json({ values: [{ optionalProperty: "paged" }], nextLink: req.baseUrl + "/multiapi/one/paging/2" }),
      };
    } else if (req.params.pagenumber === "2") {
      req.expect.containsQueryParam("api-version", "3.0.0");
      return {
        status: 200,
        body: json({ values: [{ optionalProperty: "paged" }] }),
      };
    } else {
      return {
        status: 400,
        body: json("Wrong page number. Should only be 1 or 2"),
      };
    }
  });
});
