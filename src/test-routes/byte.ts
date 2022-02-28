import { app, json } from "../api";

const bytes = Buffer.from([255, 254, 253, 252, 251, 250, 249, 248, 247, 246]);
app.category("vanilla", () => {
  app.put("/byte/nonAscii", "putByteNonAscii", (req) => {
    req.expect.bodyEquals(bytes.toString("base64"));
    return {
      status: 200,
    };
  });

  app.get("/byte/null", "getByteNull", (req) => {
    return {
      status: 200,
    };
  });

  app.get("/byte/empty", "getByteEmpty", (req) => {
    return {
      status: 200,
      body: json(""),
    };
  });

  app.get("/byte/nonAscii", "getByteNonAscii", (req) => {
    return {
      status: 200,
      body: json(bytes.toString("base64")),
    };
  });

  app.get("/byte/invalid", "getByteInvalid", (req) => {
    return {
      status: 200,
      body: json("::::SWAGGER::::"),
    };
  });
});
