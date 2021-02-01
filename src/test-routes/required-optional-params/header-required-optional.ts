import { app, ValidationError } from "../../api";

app.category("vanilla", () => {
  app.put("/reqopt/implicit/optional/header", "OptionalImplicitHeader", async (req) => {
    if (!req.headers.headerParameter) {
      throw new ValidationError("Expected query parameter to be null", null, req.query.queryParameter);
    }
    return { status: 200 };
  });
});
