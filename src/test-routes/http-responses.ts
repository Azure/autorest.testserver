import { app, HttpMethod, json } from "../api";
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
      200: ["head", "get", "options", "put", "post", "patch", "delete"],
      201: ["put", "post"],
      202: ["put", "post", "patch", "delete"],
      204: ["head", "put", "post", "patch", "delete"],
      404: ["head"],
    },
    ({ method, code }) => {
      const body = method === "get" || method === "options" ? json(true) : undefined;
      return { status: Number(code), body };
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
      307: ["head", "get", "options", "put", "post", "patch", "delete"],
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
      400: ["head", "get", "options", "put", "post", "patch", "delete"],
      401: ["head"],
      402: ["get"],
      403: ["get", "options"],
      404: ["put"],
      405: ["patch"],
      406: ["post"],
      407: ["delete"],
      409: ["put"],
      410: ["head"],
      411: ["get"],
      412: ["get", "options"],
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
      502: ["options", "put"],
      504: ["patch"],
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
      502: ["options", "get"],
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
