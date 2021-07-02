import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/llc/parameters", "LLCRequiredToOptional", (req) => {
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });
});
