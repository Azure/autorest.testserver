import { app } from "../api";

app.category("vanilla", () => {
  app.put("/reservedWords/operationGroup/import", "reservedWordsOperationGroupImport", (req) => {
    if (req.query["parameter1"] === "foo") {
      return { status: 200 };
    }
    return { status: 400 };
  });
});
