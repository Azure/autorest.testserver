import { app, json, ValidationError } from "../../api";
import { coverageService } from "../../services";

app.category("dpg", () => {
  app.get("/servicedriven/parameters", "DPGAddOptionalInput", (req) => {
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });

  coverageService.register("dpg", "DPGNewBodyType.JSON");
  coverageService.register("dpg", "DPGNewBodyType.JPEG");

  app.post("/servicedriven/parameters", "DPGNewBodyType", (req) => {
    switch (req.headers["content-type"]) {
      case "image/jpeg":
        // req.expect.rawBodyEquals("binary");
        coverageService.track("dpg", "DPGNewBodyType.JPEG");
        return { status: 200 };
      case "application/json":
        req.expect.bodyEquals({ url: "http://example.org/myimage.jpeg" });
        coverageService.track("dpg", "DPGNewBodyType.JSON");
        return { status: 200 };
      default:
        throw new ValidationError("Should be image/jpeg or application/json", {}, req.headers["content-type"]);
    }
  });

  app.delete("/servicedriven/parameters", "DPGAddNewOperation", (req) => {
    return {
      status: 204,
    };
  });

  app.get("/servicedriven/newpath", "DPGAddNewPath", (req) => {
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });
});
