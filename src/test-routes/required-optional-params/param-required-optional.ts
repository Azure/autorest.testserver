import { app } from "../../api";

app.category("vanilla", () => {
  app.get("/implicit/required/path/:pathParameter", "ImplicitRequiredParam", (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when an implicitly required path parameter is not provided.",
    };
  });

  app.get("/reqopt/global/required/path/:required_global_path", "RequiredGlobalParam", (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when an explicitly required parameter parameter is not provided.",
    };
  });
});
