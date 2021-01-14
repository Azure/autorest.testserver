import { app, json } from "../../api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.category("example" as any, () => {
  app.get("/test", "GetMyTest", (req) => {
    return {
      status: 200,
      body: json({
        foo: "succeeded",
        bar: "wut",
      }),
    };
  });

  app.post("/test", "PostMyTest", (req) => {
    req.bodyEquals({ foo: "123", bar: "456" });
    return {
      status: 200,
      body: json({
        succeeded: true,
      }),
    };
  });
});
