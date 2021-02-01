import { app } from "../../api";

app.category("vanilla", () => {
  app.put("/reqopt/implicit/optional/binary-body", "ImplicitOptionalBinaryBody", async (req) => {
    return { status: 200 };
  });

  app.put("/reqopt/explicit/optional/binary-body", "ExplicitOptionalBinaryBody", async (req) => {
    return { status: 200 };
  });

  app.put("/reqopt/explicit/required/binary-body", "ExplicitRequiredBinaryBody", async (req) => {
    req.bodyNotEmpty();
    return { status: 200 };
  });
});
