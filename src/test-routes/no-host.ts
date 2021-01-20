import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/noHost/verify", "verifyHost", (req) => {
    return {
      status: 200,
    };
  });
});
