import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/op1", "Op1", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: `"Yay you succeeded!"`,
      },
    };
  });
  app.get("/op2", "Op2", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: `"Yay you succeeded!"`,
      },
    };
  });
});
