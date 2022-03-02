import { app, json } from "../api";

app.category("vanilla", () => {
  // Returns an error response with secrets and PII in the headers and body.
  app.get("/secrets/error", "ErrorWithSecrets", (req) => {
    return {
      status: 403,
      testSuccessful: true,
      headers: {
        // Following headers should be redacted.
        "x-ms-pii": "true",

        // Following headers should not be redacted.
        "x-ms-request-id": "5e123516-834e-4222-9e80-353108d33357",
        "x-ms-version": "2022-02-01",
      },
      body: json({
        error: {
          code: "Unauthorized",
          message: "The user 'user@contoso.com' is unauthorized.",
          details: [
            {
              code: "UnauthorizedSharedKey",
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

  app.post("/secrets/[:]create", "RequestWithSecrets", (req) => {
    req.expect.containsHeader("authorization", "SharedKey 1c88a67921784300a462b2cb61da2339");
    req.expect.containsQueryParam("key", "1c88a67921784300a462b2cb61da2339");
    req.expect.bodyEquals({ key: "1c88a67921784300a462b2cb61da2339" });

    return {
      status: 200,
      headers: {
        // Following headers should be redacted.
        "x-ms-pii": "true",

        // Following headers should not be redacted.
        "x-ms-request-id": "49997f20-3cee-4c0c-92ff-572acbbed13d",
        "x-ms-version": "2022-02-01",
      },
      body: json({
        key: "1c88a67921784300a462b2cb61da2339",
        value: "secret",
      }),
    };
  });
});
