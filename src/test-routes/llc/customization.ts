import { app, json } from "../../api";

app.category("llc", () => {
  app.get("/customization/model/raw", "LLCGetRawModel", (req) => {
    return {
      status: 200,
      body: json({ received: "raw" }),
    };
  });
  app.get("/customization/model/model", "LLCGetHandwrittenModel", (req) => {
    return {
      status: 200,
      body: json({ received: "model" }),
    };
  });
  app.post("/customization/model/raw", "LLCPostRawModel", (req) => {
    req.expect.bodyEquals({ hello: `world!` });
    return {
      status: 200,
      body: json({ received: "raw" }),
    };
  });
  app.post("/customization/model/model", "LLCPostHandwrittenModel", (req) => {
    req.expect.bodyEquals({ hello: `world!` });
    return {
      status: 200,
      body: json({ received: "model" }),
    };
  });

  app.get("/customization/paging/raw/", "LLCGetRawPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ received: "raw" }], nextLink: req.baseUrl + "/customization/paging/raw/2" }),
    };
  });
  app.get("/customization/paging/model/", "LLCGetHandwrittenModelPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ received: "model" }], nextLink: req.baseUrl + "/customization/paging/model/2" }),
    };
  });
  app.get("/customization/paging/:mode/2", "", (req) => {
    return {
      status: 200,
      body: json({ values: [{ received: req.params.mode?.toString() }] }),
    };
  });

  app.put("/customization/lro/raw", "LLCRawLRO", (req) => {
    return {
      status: 200,
      body: json({ provisioningState: "Succeeded", received: "raw" }),
    };
  });
  app.put("/customization/lro/model", "LLCHandwrittenModelLRO", (req) => {
    return {
      status: 200,
      body: json({ provisioningState: "Succeeded", received: "model" }),
    };
  });
});
