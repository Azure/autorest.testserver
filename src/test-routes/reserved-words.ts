import { app } from "../api";

app.category("vanilla", () => {
  app.put("/reservedWords/operationGroup/import", "reservedWordsOperationGroupImport", (req) => {
    if (req.query["parameter1"] === "foo") {
      return { status: 200 };
    }
    return { status: 400 };
  });

  app.put("/reservedWords/operation/content", "reservedWordsBodyNamedContent", (req) => {
    req.expect.bodyEquals(Buffer.from("hello, world"));
    return { status: 200 };
  });
  app.put("/reservedWords/operation/json", "reservedWordsBodyNamedJson", (req) => {
    req.expect.bodyEquals({ hello: "world" });
    return { status: 200 };
  });
  app.put("/reservedWords/operation/data", "reservedWordsBodyNamedData", (req) => {
    req.expect.bodyEquals({ data: "hello", world: "world" });
    return { status: 200 };
  });
  app.put("/reservedWords/operation/files", "reservedWordsBodyNamedFiles", (req) => {
    return { status: 200 };
  });
});
