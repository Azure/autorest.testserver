import { app, json } from "../api";

app.category("vanilla", () => {
  // Returns an error response with secrets and PII in the headers and body.
  app.get("/insecureError", "InsecureError", (req) => {
    return {
      status: 403,
      headers: {
        // Wouldn't expect "Authorization" to be in response, but this helps test redaction (or lack thereof) of loggers.
        "Authorization": "SharedKey contoso:1c88a67921784300a462b2cb61da2339",
        "x-ms-request-id": "5e123516-834e-4222-9e80-353108d33357",
        "x-ms-version": "2022-02-01",
      },
      body: json({
        error: {
          code: "Unauthorized",
          message: "The user 'user@contoso.com' is unauthorized.",
          details: [
            {
              code: "UnauthorizedAccessToken",
              innererror: "Shared key 1c88a67921784300a462b2cb61da2339 is not permitted access.",
            },
          ],
          token: "1c88a67921784300a462b2cb61da2339",
        },
        primaryKey: "1c88a67921784300a462b2cb61da2339",
        connectionString: "Key1=1c88a67921784300a462b2cb61da2339",
      }),
    };
  });
});
