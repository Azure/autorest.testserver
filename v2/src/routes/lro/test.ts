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
