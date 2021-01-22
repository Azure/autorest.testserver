import { app, json } from "../api";
app.category("vanilla", () => {
  app.get("/incorrectError", "verifyIncorrectErrorParsing", (req) => {
    return {
      status: 444,
      body: {
        contentType: "text/html",
        rawContent: "foobar",
      }
    };
  });
});
