import { app, json, ValidationError } from "../../api";
import { coverageService } from "../../services";

/**
 * Scenarios to test DPG and RLC Service driven evolution.
 * These scenarios here are considered acceptable from an Azure breaking change policy
 */
app.category("dpg", () => {
  /**
   * Initially only has one required Query Parameter. After evolution, a new optional query parameter is added.
   */
  app.get("/servicedriven/parameters", "DPGAddOptionalInput", (req) => {
    if (req.query["parameter"]) {
      coverageService.track("dpg", "DPGAddOptionalInput");
      return {
        status: 200,
        body: json({ message: `An object was successfully returned` }),
      };
    } else {
      return {
        status: 400,
        body: json({ message: `Expected required parameter "parameter"` }),
      };
    }
  });

  /**
   * Initially has no query parameters. After evolution, a new optional query parameter is added
   */
  app.head("/servicedriven/parameters", "DPGAddOptionalInput_NoParams", (req) => {
    coverageService.track("dpg", "DPGAddOptionalInput_NoParams");
    return {
      status: 200,
      headers: { "content-length": "0" },
    };
  });

  /**
   * Initially has one required query parameter and one optional query parameter.  After evolution, a new optional query parameter is added
   */
  app.put("/servicedriven/parameters", "DPGAddOptionalInput_RequiredOptionalParam", (req) => {
    if (req.query["requiredParam"]) {
      coverageService.track("dpg", "DPGAddOptionalInput_RequiredOptionalParam");
      return {
        status: 200,
        body: json({ message: `An object was successfully returned` }),
      };
    } else {
      return {
        status: 400,
        body: json({ message: `Expected required parameter "requiredParam"` }),
      };
    }
  });

  /**
   * Initially has one optional query parameter. After evolution, a new optional query parameter is added
   */
  app.get("/serviceDriven/moreParameters", "DPGAddOptionalInput_OptionalParam", (req) => {
    coverageService.track("dpg", "DPGAddOptionalInput_OptionalParam");
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });

  /**
   * A new body type is added (was JSON, and now JSON + JPEG).
   */
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

  /**
   * Initially the path exists but there is no delete method. After evolution this is a new method in a known path
   */
  app.delete("/servicedriven/parameters", "DPGAddNewOperation", (req) => {
    coverageService.track("dpg", "DPGAddNewOperation");
    return {
      status: 204,
    };
  });

  /**
   * Initially neither path or method exist for this operation. After evolution, this is a new method in a new path
   */
  app.get("/servicedriven/newpath", "DPGAddNewPath", (req) => {
    coverageService.track("dpg", "DPGAddNewPath");
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });

  /**
   * An operation that is not part of the swagger definition but can be called
   */
  app.get("/servicedriven/glassbreaker", "DPGGlassBreaker", (req) => {
    coverageService.track("dpg", "DPGGlassBreaker");
    return {
      status: 200,
      body: json({ message: `An object was successfully returned` }),
    };
  });
});
