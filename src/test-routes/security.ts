import { app, json } from "../api";

app.category("vanilla", () => {
  app.head("/securitykey", "SecurityKey", (req) => {
    req.expect.containsHeader("security-key", "123456789");

    return {
      status: 200,
    };
  });
});

app.category("vanilla", () => {
  app.head("/securityaad", "SecurityAad", (req) => {
    req.expect.containsHeader("authorization", "Bearer https://security.microsoft.com/.default");

    return {
      status: 200,
    };
  });
});
