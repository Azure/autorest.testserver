import { app, json } from "../api";
import { coverageService } from "../services";
app.category("vanilla", () => {
  app.get("/incorrectError", "verifyIncorrectErrorParsing", async (req) => {
    await coverageService.track("vanilla", "verifyIncorrectErrorParsing");
    return {
      status: 444,
      body: {
        contentType: "text/html",
        rawContent: "foobar",
      },
    };
  });
});
