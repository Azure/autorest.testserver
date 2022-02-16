import { app, json } from "../../api";

app.category("dpg", () => {
  app.get("/customization/model/raw", "GetRawModel", (req) => {
    return {
      status: 200,
      body: json({ received: "raw" }),
    };
  });
  app.get("/customization/model/model", "GetHandwrittenModel", (req) => {
    return {
      status: 200,
      body: json({ received: "model" }),
    };
  });
  app.post("/customization/model/raw", "PostRawModel", (req) => {
    req.expect.bodyEquals({ hello: `world!` });
    return {
      status: 200,
      body: json({ received: "raw" }),
    };
  });
  app.post("/customization/model/model", "PostHandwrittenModel", (req) => {
    req.expect.bodyEquals({ hello: `world!` });
    return {
      status: 200,
      body: json({ received: "model" }),
    };
  });

  app.get("/customization/paging/:mode/", "", (req) => {
    return {
      status: 200,
      body: json({
        values: [{ received: req.params.mode?.toString() }],
        nextLink: req.baseUrl + "/customization/paging/" + req.params.mode + "/2",
      }),
    };
  });
  app.get("/customization/paging/raw/2", "GetRawPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ received: "raw" }] }),
    };
  });
  app.get("/customization/paging/model/2", "GetHandwrittenModelPages", (req) => {
    return {
      status: 200,
      body: json({ values: [{ received: "model" }] }),
    };
  });

  app.put("/customization/lro/raw", "RawLRO", (req) => {
    return {
      status: 200,
      body: json({ provisioningState: "Succeeded", received: "raw" }),
    };
  });
  app.put("/customization/lro/model", "HandwrittenModelLRO", (req) => {
    return {
      status: 200,
      body: json({ provisioningState: "Succeeded", received: "model" }),
    };
  });
});
