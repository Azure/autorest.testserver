import { app } from "../api";

app.category("vanilla", () => {
  app.head("/clientEnum/head", "getBoolTrue", (req) => {
    req.expect.containsHeader("x-ms-enum", "single");
    return {
      status: 200,
    };
  });
});
