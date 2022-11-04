import { app } from "../api";

app.category("vanilla", () => {
  app.head("/clientEnum/head", "ClientWithEnumParam", (req) => {
    req.expect.containsHeader("x-ms-enum", "single");
    return {
      status: 200,
    };
  });
});
