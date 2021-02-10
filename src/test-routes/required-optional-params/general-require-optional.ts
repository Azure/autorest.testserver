import { app, json, ValidationError } from "../../api";
import { coverageService } from "../../services";
import { toPascalCase } from "../../utils";

app.category("vanilla", () => {
  // This API should never be called so remove the name for coverage.
  app.put("/reqopt/required/:type/:scenario", undefined, (req) => {
    return {
      status: 400,
      message: "Client library failed to throw when a required value type is not provided.",
    };
  });

  app.post("/reqopt/optional/:type/:scenario", "GeneralOptional", (req) => {
    const { scenario, type } = req.params;
    const covered = `Optional${toPascalCase(type)}${toPascalCase(scenario)}`;

    if (req.params.scenario === "parameter") {
      req.expect.bodyEmpty();
      coverageService.track("vanilla", covered);
      return { status: 200 };
    } else if (req.params.scenario === "property") {
      if (typeof req.body !== "object" || req.body == null) {
        throw new ValidationError("Should be passing an object", {}, req.body);
      }

      if ("value" in req.body && req.body.value !== null && req.body.value !== undefined) {
        throw new ValidationError("Property value should be null", null, req.body.value);
      } else {
        coverageService.track("vanilla", covered);
        return { status: 200 };
      }
    } else if (req.params.scenario === "header") {
      if (req.headers.headerParameter) {
        throw new ValidationError("Expected header to be null", null, req.query.queryParameter);
      }
      coverageService.track("vanilla", covered);
      return { status: 200 };
    } else if (req.params.scenario === "response") {
      coverageService.track("vanilla", covered);
      return { status: 200 };
    } else if (req.params.scenario === "responseProperty") {
      coverageService.track("vanilla", covered);
      return { status: 200, body: json({ value: null }) };
    } else if (req.params.scenario === "responseHeader") {
      coverageService.track("vanilla", covered);
      return { status: 200, headers: { value: null } };
    }

    return { status: 404, body: json({ message: `Unkown scenario ${scenario}` }) };
  });
});
