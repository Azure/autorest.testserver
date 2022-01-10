import { request } from "express";
import { app, json } from "../api";

app.category("vanilla", () => {
  app.patch("/mergePatchJson/single", "PassMergePatchObject", (req) => {
    req.expect.containsHeader("content-type", "application/merge-patch+json");
    req.expect.containsHeader("content-length", "14");
    return {
      status: 200,
    };
  });
});
