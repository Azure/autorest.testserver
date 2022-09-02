import { app, json } from "../api";
import { coverageService } from "../services";

app.category("vanilla", () => {
  app.post("/binary/file", "BodyBinaryFile", (req) => {
    req.expect.containsHeader("content-type", "application/json");
    req.expect.bodyEquals({ more: "cowbell" });
    return { status: 200 };
  });
  app.put("/binary/octet", "BodyBinaryOctet", (req) => {
    req.expect.containsHeader("content-type", "application/octet-stream");
    req.expect.bodyNotEmpty();
    return { status: 200 };
  });
  app.get("/binary/error", "BodyBinaryError", async (req) => {
    await coverageService.track("vanilla", "BodyBinaryError");
    return { status: 400, body: json({ status: 400, message: `I failed on purpose` }) };
  });
});
