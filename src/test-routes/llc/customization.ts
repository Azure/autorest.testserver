import { app, json } from "../../api";

app.category("llc", () => {
  app.get("/customization/getModel/raw", "LLCGetRawModel", (req) => {
    return {
      status: 200,
      body: json({ received: "raw" }),
    };
  });
  app.get("/customization/getModel/model", "LLCGetHandwrittenModel", (req) => {
    return {
      status: 200,
      body: json({ received: "model" }),
    };
  });
  app.get("/customization/paging/raw/", "LLCGetRawPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ "received": "raw" }], "nextLink": req.baseUrl + "/customization/paging/raw/2" })
    };
  });
  app.get("/customization/paging/model/", "LLCGetHandwrittenModelPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ "received": "model" }], "nextLink": req.baseUrl + "/customization/paging/model/2" })
    };
  });
  app.get("/customization/paging/:mode/2", "", (req) => {
    return {
      status: 200,
      body: json({ values: [{ "received": req.params.mode?.toString() }] })
    };
  });
});
