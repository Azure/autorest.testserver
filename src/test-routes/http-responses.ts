import { strictEqual } from "assert";
import { app, HttpMethod, json } from "../api";

interface Data {
  [code: number]: HttpMethod[];
}

const scenarios = {
  Success: {
    200: {
      head: "HttpSuccess200Head",
      get: "HttpSuccess200Get",
      options: "HttpSuccess200Options",
      put: "HttpSuccess200Put",
      post: "HttpSuccess200Post",
      patch: "HttpSuccess200Patch",
      delete: "HttpSuccess200Delete",
    },
    201: {
      put: "HttpSuccess201Put",
      post: "HttpSuccess201Post",
    },
    202: {
      put: "HttpSuccess202Put",
      post: "HttpSuccess202Post",
      patch: "HttpSuccess202Patch",
      delete: "HttpSuccess202Delete",
    },
    204: {
      head: "HttpSuccess204Head",
      put: "HttpSuccess204Put",
      post: "HttpSuccess204Post",
      patch: "HttpSuccess204Patch",
      delete: "HttpSuccess204Delete",
    },
    404: {
      head: "HttpSuccess404Head",
    },
  },
  Redirect: {
    300: {
      head: "HttpRedirect300Head",
      get: "HttpRedirect300Get",
    },
    301: {
      head: "HttpRedirect301Head",
      put: "HttpRedirect301Put",
      get: "HttpRedirect301Get",
    },
    302: {
      head: "HttpRedirect302Head",
      get: "HttpRedirect302Get",
      patch: "HttpRedirect302Patch",
    },
    303: {
      post: "HttpRedirect303Post",
    },
    307: {
      head: "HttpRedirect307Head",
      get: "HttpRedirect307Get",
      options: "HttpRedirect307Options",
      put: "HttpRedirect307Put",
      post: "HttpRedirect307Post",
      patch: "HttpRedirect307Patch",
      delete: "HttpRedirect307Delete",
    },
  },
  Retry: {
    408: {
      head: "HttpRetry408Head",
    },
    502: {
      options: "HttpRetry502Options",
      get: "HttpRetry502Get",
    },
    500: {
      put: "HttpRetry500Put",
      patch: "HttpRetry500Patch",
    },
    503: {
      post: "HttpRetry503Post",
      delete: "HttpRetry503Delete",
    },
    504: {
      put: "HttpRetry504Put",
      patch: "HttpRetry504Patch",
    },
  },
  Failure: {
    400: {
      head: "HttpClientFailure400Head",
      get: "HttpClientFailure400Get",
      options: "HttpClientFailure400Options",
      put: "HttpClientFailure400Put",
      post: "HttpClientFailure400Post",
      patch: "HttpClientFailure400Patch",
      delete: "HttpClientFailure400Delete",
    },
    401: {
      head: "HttpClientFailure401Head",
    },
    402: {
      get: "HttpClientFailure402Get",
    },
    403: {
      get: "HttpClientFailure403Get",
      options: "HttpClientFailure403Options",
    },
    404: {
      put: "HttpClientFailure404Put",
    },
    405: {
      patch: "HttpClientFailure405Patch",
    },
    406: {
      post: "HttpClientFailure406Post",
    },
    407: {
      delete: "HttpClientFailure407Delete",
    },
    409: {
      put: "HttpClientFailure409Put",
    },
    410: {
      head: "HttpClientFailure410Head",
    },
    411: {
      get: "HttpClientFailure411Get",
    },
    412: {
      get: "HttpClientFailure412Get",
      options: "HttpClientFailure412Options",
    },
    413: {
      put: "HttpClientFailure413Put",
    },
    414: {
      patch: "HttpClientFailure414Patch",
    },
    415: {
      post: "HttpClientFailure415Post",
    },
    416: {
      get: "HttpClientFailure416Get",
    },
    417: {
      delete: "HttpClientFailure417Delete",
    },
    429: {
      head: "HttpClientFailure429Head",
    },
    501: {
      head: "HttpServerFailure501Head",
      get: "HttpServerFailure501Get",
    },
    502: {
      options: "HttpServerFailure502Options",
      put: "HttpServerFailure502Put",
    },
    504: {
      patch: "HttpServerFailure504Patch",
    },
    505: {
      post: "HttpServerFailure505Post",
      delete: "HttpServerFailure505Delete",
    },
  },
};

// for (const [name, data] of Object.entries(scenarios)) {
//   for (const [code, data2] of Object.entries(data)) {
//     for (const [verb, coverageName] of Object.entries(data2)) {
//       strictEqual(coverageName, `Http${capitalize(name)}${code}${capitalize(verb)}`);
//     }
//   }
// }

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

app.category("vanilla", () => {
  function registerScenarios(basePath: string, name: string, scenarios: Data) {
    for (const [code, methods] of Object.entries(scenarios)) {
      for (const method of methods as HttpMethod[]) {
        const coverageName = `Http${capitalize(name)}${code}${capitalize(method)}`;
        const body = method === "get" || method === "options" ? json(true) : undefined;

        app[method](`/http${basePath}/${code}`, coverageName, (req) => {
          return { status: Number(code), body };
        });
      }
    }
  }

  registerScenarios("/success", "Success", {
    200: ["head", "get", "options", "put", "post", "patch", "delete"],
    201: ["put", "post"],
    202: ["put", "post", "patch", "delete"],
    204: ["head", "put", "post", "patch", "delete"],
    404: ["head"],
  });
});
