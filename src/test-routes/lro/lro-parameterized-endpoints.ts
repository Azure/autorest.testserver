import { app, json } from "../../api";

app.category("azure", () => {
  app.post("/lroConstantParameterizedEndpoints/iAmConstant", "LROConstantParameterizedPost", (req) => {
    return {
      status: 202,
      headers: {
        "Location": '/lroConstantParameterizedEndpoints/iAmConstant/results/1',
      },
    };
  });

  app.get(
    "/lroConstantParameterizedEndpoints/iAmConstant/results/:resultNumber",
    "LROConstantParameterizedGet",
    (req) => {
      return {
        status: 200,
        body: json("success"),
      };
    },
  );
});
