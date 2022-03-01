import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/bool/true", "getBoolTrue", (req) => {
    return { status: 200, body: json(true) };
  });
  app.put("/bool/true", "putBoolTrue", (req) => {
    req.expect.bodyEquals(true);
    return { status: 200 };
  });
  app.get("/bool/false", "getBoolFalse", (req) => {
    return { status: 200, body: json(false) };
  });
  app.put("/bool/false", "putBoolFalse", (req) => {
    req.expect.bodyEquals(false);
    return { status: 200 };
  });

  app.get("/bool/null", "getBoolNull", (req) => {
    return { status: 200 };
  });

  app.get("/bool/invalid", "getBoolInvalid", (req) => {
    return { status: 200, body: { rawContent: "true1", contentType: "application/json" } };
  });
});
