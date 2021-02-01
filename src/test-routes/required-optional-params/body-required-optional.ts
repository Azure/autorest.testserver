import { app, ValidationError } from "../../api";

app.category("vanilla", () => {
  app.put("/reqopt/implicit/optional/body", "OptionalImplicitBody", async (req) => {
    req.bodyEmpty();
    return { status: 200 };
  });
});
