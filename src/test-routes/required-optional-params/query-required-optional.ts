import { app, ValidationError } from "../../api";

app.category("vanilla", () => {
  app.put("/reqopt/implicit/optional/query", "OptionalImplicitQuery", async (req) => {
    if (req.query.queryParameter) {
      throw new ValidationError("Expected query parameter to be null", null, req.query.queryParameter);
    }
    return { status: 200 };
  });

  // This API should never be called so remove the name for coverage.
  app.get("/reqopt/global/required/query", undefined, (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when an explicitly required query parameter is not provided.",
    };
  });

  app.get("/reqopt/global/optional/query", "OptionalGlobalQuery", (req) => {
    if (req.query.optional_global_query) {
      throw new ValidationError("Expected query parameter to be null", null, req.query.queryParameter);
    }
    return { status: 200 };
  });
});
