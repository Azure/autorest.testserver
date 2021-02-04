import { app } from "../../api";

app.category("vanilla", () => {
  // This API should never be called so remove the name for coverage.
  app.get("/implicit/required/path/:pathParameter", undefined, (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when an implicitly required path parameter is not provided.",
    };
  });

  // This API should never be called so remove the name for coverage.
  app.get("/reqopt/global/required/path/:required_global_path", undefined, (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when an explicitly required parameter parameter is not provided.",
    };
  });
});
