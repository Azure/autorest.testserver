import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/anything/string", "GetStringAsAnything", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: `"foo"`,
      },
    };
  });

  app.put("/anything/string", "PutStringAsAnything", (req) => {
    req.expect.rawBodyEquals('"anything"');
    return { status: 200 };
  });

  app.get("/anything/object", "GetObjectAsAnything", (req) => {
    return { status: 200, body: json({ message: `An object was successfully returned` }) };
  });

  app.put("/anything/object", "PutObjectAsAnything", (req) => {
    req.expect.bodyEquals({ foo: `bar` });
    return { status: 200 };
  });

  app.get("/anything/array", "GetArrayAsAnything", (req) => {
    return { status: 200, body: json(["foo", "bar"]) };
  });

  app.put("/anything/array", "PutArrayAsAnything", (req) => {
    req.expect.bodyEquals(["foo", "bar"]);
    return { status: 200 };
  });
});
