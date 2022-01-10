import { app, json } from "../api";

app.category("vanilla", () => {
  app.patch("/mergePatchJson/single", "PassMergePatchObject", (req) => {
    if (req.headers["content-type"] === "application/merge-patch+json" && req.headers["content-length"] === "14") {
      return {
        status: 200,
      };
    } else {
      return {
        status: 400,
      };
    }
  });
});
