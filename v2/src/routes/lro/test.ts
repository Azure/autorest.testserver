import { app, json } from "../../api";

app.get("/test", "GetMyTest", (req) => {
  return {
    status: 200,
    body: json({
      foo: "succeeded",
      bar: "wut",
    }),
  };
});

app.post("/test", "GetMyTest2", (req) => {
  req.bodyEquals({ foo: "123", bar: "456" });
  return {
    status: 200,
    body: json({
      succeeded: true,
    }),
  };
});
