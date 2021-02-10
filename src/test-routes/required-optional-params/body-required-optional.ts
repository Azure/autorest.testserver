import { app, ValidationError } from "../../api";

app.category("vanilla", () => {
  app.put("/reqopt/implicit/optional/body", "OptionalImplicitBody", async (req) => {
    req.expect.bodyEmpty();
    return { status: 200 };
  });
});
