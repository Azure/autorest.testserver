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
});
