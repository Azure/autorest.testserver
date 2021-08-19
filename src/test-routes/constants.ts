import { app } from "../api";

app.category("vanilla", () => {
  app.put("/constants/clientConstants/path", "ConstantClientProperties", (req) => {
    if (req.query["query-constant"] !== "100" || req.headers["header-constant"] !== "true") {
      return { status: 400 };
    }
    return { status: 200 };
  });
});
