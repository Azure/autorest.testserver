import { app, json, ValidationError } from "../../api";
import { coverageService } from "../../services";

app.category("llc", () => {
  app.get("/servicedriven/parameters", "LLCAddOptionalInput", (req) => {
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });

  coverageService.register("llc", "LLCNewBodyType.JSON");
  coverageService.register("llc", "LLCNewBodyType.JPEG");

  app.post("/servicedriven/parameters", "LLCNewBodyType", (req) => {
    switch (req.headers["content-type"]) {
      case "image/jpeg":
        // req.expect.rawBodyEquals("binary");
        coverageService.track("llc", "LLCNewBodyType.JPEG");
        return { status: 200 };
      case "application/json":
        req.expect.bodyEquals({ url: "http://example.org/myimage.jpeg" });
        coverageService.track("llc", "LLCNewBodyType.JSON");
        return { status: 200 };
      default:
        throw new ValidationError("Should be image/jpeg or application/json", {}, req.headers["content-type"]);
    }
  });

  app.delete("/servicedriven/parameters", "LLCAddNewOperation", (req) => {
    return {
      status: 204,
    };
  });

  app.get("/servicedriven/newpath", "LLCAddNewPath", (req) => {
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });
});
