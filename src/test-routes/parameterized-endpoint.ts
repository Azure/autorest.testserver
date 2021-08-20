import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/parameterizedEndpoint/get", "GetParameterizedHostWithNameEndpoint", (req) => {
    return {
      status: 200,
    };
  });
});
