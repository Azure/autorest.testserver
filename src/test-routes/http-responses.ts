import { app, HttpMethod, json, ValidationError } from "../api";
import { MockRequest } from "../api/mock-request";
import { MockResponse } from "../api/mock-response";

interface Data {
  [code: number]: HttpMethod[];
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

app.category("vanilla", () => {
  function registerScenarios(
    basePath: string,
    name: string,
    scenarios: Data,
    handler: (config: { method: HttpMethod; code: number }, req: MockRequest) => MockResponse | Promise<MockResponse>,
  ) {
    for (const [code, methods] of Object.entries(scenarios)) {
      for (const method of methods as HttpMethod[]) {
        const coverageName = `Http${capitalize(name)}${code}${capitalize(method)}`;

        app[method](`/http${basePath}/${code}`, coverageName, (req) => {
          return handler({ code: Number(code), method }, req);
        });
      }
    }
  }

  registerScenarios(
    "/success",
    "Success",
    {
      200: ["head", "get", "put", "post", "patch", "delete"],
      201: ["put", "post"],
      202: ["put", "post", "patch", "delete"],
      204: ["head", "put", "post", "patch", "delete"],
      404: ["head"],
    },
    ({ method, code }) => {
      const body = method === "get" ? json(true) : undefined;
      return { status: Number(code), body, testSuccessful: true };
    },
  );

  // Use in redirection
  app.router.all("/http/success/:method/:code", (req, res, next) => {
    if (req.method.toLowerCase() === req.params.method) {
      res.status(JSON.parse(req.params.code)).end();
    } else {
      res.send(400);
    }
  });

  registerScenarios(
    "/redirect",
    "Redirect",
    {
      300: ["head", "get"],
      301: ["head", "put", "get"],
      302: ["head", "get", "patch"],
      303: ["post"],
      307: ["head", "get", "put", "post", "patch", "delete"],
    },
    ({ code, method }) => {
      let location;
      if ((code === 301 || code === 302) && method !== "head" && method !== "get") {
        location = "/http/failure/500";
      } else if (code === 303) {
        location = "/http/success/get/200";
      } else {
        location = `/http/success/${method}/200`;
      }

      const body = method === "get" && code === 300 ? json(["/http/success/get/200"]) : undefined;

      return {
        testSuccessful: true,
        status: code,
        headers: {
          Location: location,
        },
        body,
      };
    },
  );

  registerScenarios(
    "/failure/client",
    "ClientFailure",
    {
      400: ["head", "get", "put", "post", "patch", "delete"],
      401: ["head"],
      402: ["get"],
      403: ["get"],
      404: ["put"],
      405: ["patch"],
      406: ["post"],
      407: ["delete"],
      409: ["put"],
      410: ["head"],
      411: ["get"],
      412: ["get"],
      413: ["put"],
      414: ["patch"],
      415: ["post"],
      416: ["get"],
      417: ["delete"],
      429: ["head"],
    },
    ({ code, method }) => {
      return {
        status: code,
        testSuccessful: true,
      };
    },
  );

  registerScenarios(
    "/failure/server",
    "ServerFailure",
    {
      501: ["head", "get"],
      505: ["post", "delete"],
    },
    ({ code, method }) => {
      return {
        status: code,
        testSuccessful: true,
      };
    },
  );

  registerScenarios(
    "/retry",
    "Retry",
    {
      408: ["head"],
      502: ["get"],
      500: ["put", "patch"],
      503: ["post", "delete"],
      504: ["put", "patch"],
    },
    ({ code, method }, req) => {
      if (isRetryRequest(req, code, method)) {
        removeRetryTracker(req);
        return {
          status: 200,
        };
      } else {
        addRetryTracker(req, code, method);
        return {
          status: code,
        };
      }
    },
  );

  //#region Multiple responses described as 204
  app.get(
    "/http/payloads/200/A/204/none/default/Error/response/200/valid",
    "ResponsesScenarioA200MatchingModel",
    (req) => {
      return { status: 200, body: json({ statusCode: "200" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/204/none/default/Error/response/201/valid",
    "ResponsesScenarioA201DefaultNoModel",
    (req) => {
      return { status: 201, body: json({ statusCode: "201" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/204/none/default/Error/response/202/none",
    "ResponsesScenarioA202DefaultNoModel",
    (req) => {
      return { status: 202, body: json({ statusCode: "202" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/204/none/default/Error/response/204/none",
    "ResponsesScenarioA204MatchingNoModel",
    (req) => {
      return { status: 204 };
    },
  );

  app.get(
    "/http/payloads/200/A/204/none/default/Error/response/400/valid",
    "ResponsesScenarioA400DefaultModel",
    (req) => {
      return { status: 400, testSuccessful: true, body: json({ message: "client error" }) };
    },
  );
  // #endregion

  //#region Endpoint with response for 200, 201 default
  app.get(
    "/http/payloads/200/A/201/B/default/Error/response/200/valid",
    "ResponsesScenarioB200MatchingModel",
    (req) => {
      return { status: 200, body: json({ statusCode: "200" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/201/B/default/Error/response/201/valid",
    "ResponsesScenarioB201MatchingModel",
    (req) => {
      return { status: 201, body: json({ statusCode: "201", textStatusCode: "Created" }) };
    },
  );

  app.get("/http/payloads/200/A/201/B/default/Error/response/400/valid", "ResponsesScenarioB400DefaultModel", (req) => {
    return { status: 400, testSuccessful: true, body: json({ message: "client error" }) };
  });
  // #endregion

  //#region Endpoint with response for 200, 201, 404 and default
  app.get(
    "/http/payloads/200/A/201/C/404/D/default/Error/response/200/valid",
    "ResponsesScenarioC200MatchingModel",
    (req) => {
      return { status: 200, body: json({ statusCode: "200" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/201/C/404/D/default/Error/response/201/valid",
    "ResponsesScenarioC201MatchingModel",
    (req) => {
      return { status: 201, body: json({ httpCode: "201" }) };
    },
  );
  app.get(
    "/http/payloads/200/A/201/C/404/D/default/Error/response/404/valid",
    "ResponsesScenarioC404MatchingModel",
    (req) => {
      return { status: 404, testSuccessful: true, body: json({ httpStatusCode: "404" }) };
    },
  );

  app.get(
    "/http/payloads/200/A/201/C/404/D/default/Error/response/400/valid",
    "ResponsesScenarioC400DefaultModel",
    (req) => {
      return { status: 400, testSuccessful: true, body: json({ message: "client error" }) };
    },
  );
  // #endregion

  //#region Endpoint with response for 202, 204 where it is returning empty body.
  app.get(
    "/http/payloads/202/none/204/none/default/Error/response/202/none",
    "ResponsesScenarioD202MatchingNoModel",
    (req) => {
      return { status: 202 };
    },
  );

  app.get(
    "/http/payloads/202/none/204/none/default/Error/response/204/none",
    "ResponsesScenarioD204MatchingNoModel",
    (req) => {
      return { status: 204 };
    },
  );

  app.get(
    "/http/payloads/202/none/204/none/default/Error/response/400/valid",
    "ResponsesScenarioD400DefaultModel",
    (req) => {
      return { status: 400, testSuccessful: true, body: json({ message: "client error" }) };
    },
  );
  // #endregion

  //#region Endpoint with response for 202, 204, 400 returning invalid payloads
  app.get(
    "/http/payloads/202/none/204/none/default/none/response/202/invalid",
    "ResponsesScenarioE202MatchingInvalid",
    (req) => {
      return { status: 202, body: json({ property: "value" }) };
    },
  );

  app.get(
    "/http/payloads/202/none/204/none/default/none/response/204/none",
    "ResponsesScenarioE204MatchingNoModel",
    (req) => {
      return { status: 204 };
    },
  );

  app.get(
    "/http/payloads/202/none/204/none/default/none/response/400/none",
    "ResponsesScenarioE400DefaultNoModel",
    (req) => {
      return { status: 400, testSuccessful: true };
    },
  );
  app.get(
    "/http/payloads/202/none/204/none/default/none/response/400/invalid",
    "ResponsesScenarioE400DefaultInvalid",
    (req) => {
      return { status: 400, testSuccessful: true, body: json({ property: "value" }) };
    },
  );
  // #endregion

  //#region Endpoint with response for 202, 204, 400 returning valid payloads
  app.get("/http/payloads/default/a/response/200/valid", "ResponsesScenarioF200DefaultModel", (req) => {
    return { status: 200, body: json({ property: "value" }) };
  });

  app.get("/http/payloads/default/a/response/200/none", "ResponsesScenarioF200DefaultNone", (req) => {
    return { status: 200 };
  });

  app.get("/http/payloads/default/a/response/400/valid", "ResponsesScenarioF400DefaultModel", (req) => {
    return { status: 400, testSuccessful: true };
  });
  app.get("/http/payloads/default/a/response/400/none", "ResponsesScenarioF400DefaultNone", (req) => {
    return { status: 400, testSuccessful: true, body: json({ property: "value" }) };
  });
  // #endregion

  //#region Endpoint with response for 202, 204, 400 returning invalid payloads
  app.get("/http/payloads/default/none/response/200/invalid", "ResponsesScenarioG200DefaultInvalid", (req) => {
    return { status: 200, body: json({ statusCode: "200" }) };
  });

  app.get("/http/payloads/default/none/response/200/none", "ResponsesScenarioG200DefaultNoModel", (req) => {
    return { status: 200 };
  });

  app.get("/http/payloads/default/none/response/400/invalid", "ResponsesScenarioG400DefaultInvalid", (req) => {
    return { status: 400, testSuccessful: true, body: json({ statusCode: "200" }) };
  });

  app.get("/http/payloads/default/none/response/400/none", "ResponsesScenarioG400DefaultNoModel", (req) => {
    return { status: 400, testSuccessful: true };
  });
  // #endregion

  //#region Endpoint with response for 202, 204, 400 returning invalid payloads
  app.get("/http/payloads/200/a/response/200/none", "ResponsesScenarioH200MatchingNone", (req) => {
    return { status: 200 };
  });

  app.get("/http/payloads/200/a/response/200/valid", "ResponsesScenarioH200MatchingModel", (req) => {
    return { status: 200 };
  });

  app.get("/http/payloads/200/a/response/200/invalid", "ResponsesScenarioH200MatchingInvalid", (req) => {
    return { status: 200, body: json({ statusCodeInvalid: "200" }) };
  });

  app.get("/http/payloads/200/a/response/400/none", "ResponsesScenarioH400NonMatchingNone", (req) => {
    return { status: 400, testSuccessful: true, body: json({ statusCode: "200" }) };
  });

  app.get("/http/payloads/200/a/response/400/valid", "ResponsesScenarioH400NonMatchingModel", (req) => {
    return { status: 400, testSuccessful: true, body: json({ statusCode: "200" }) };
  });
  app.get("/http/payloads/200/a/response/400/invalid", "ResponsesScenarioH400NonMatchingInvalid", (req) => {
    return { status: 400, testSuccessful: true, body: json({ statusCodeInvalid: "200" }) };
  });

  app.get("/http/payloads/200/a/response/202/valid", "ResponsesScenarioH202NonMatchingModel", (req) => {
    return { status: 202, testSuccessful: true, body: json({ statusCode: "200" }) };
  });
  // #endregion

  app.get("/http/failure/emptybody/error", "ResponsesScenarioEmptyErrorBody", () => {
    return { status: 400, testSuccessful: true, body: json({ message: "" }) };
  });

  app.get("/http/failure/nomodel/error", "ResponsesScenarioNoModelErrorBody", () => {
    return { status: 400, testSuccessful: true, body: json({ message: "NoErrorModel" }) };
  });
  app.get("/http/failure/nomodel/empty", "ResponsesScenarioNoModelEmptyBody", () => {
    return { status: 400, testSuccessful: true };
  });
});

function isRetryRequest(req: MockRequest, code: number, method: HttpMethod) {
  const cookies = req.headers["cookie"];
  let cookieMatch;
  if (cookies) {
    cookieMatch = /tries=(\w+)/.exec(cookies);
    if (cookieMatch && cookieMatch[1] && cookieMatch[1] === code + "_" + method) {
      return true;
    }
  }

  return false;
}

function addRetryTracker(req: MockRequest, code: number, method: HttpMethod) {
  req.originalRequest.res?.cookie("tries", code + "_" + method, { maxAge: 900000 });
}

function removeRetryTracker(req: MockRequest) {
  req.originalRequest.res?.clearCookie("tries");
}
