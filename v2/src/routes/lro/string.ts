import { app, json } from "../../api";

app.get("/string/null", "getStringNull", (req) => {
  return {
    status: 200,
    body: {
      contentType: "application/json",
      rawContent: undefined,
    },
  };
});

app.put("/string/null", "putStringNull", (req) => {
  req.rawBodyMatch(undefined);
  return { status: 200 };
});
