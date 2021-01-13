import { app, json } from "../../api";

app.category("azure", () => {
  app.post("/lro/LROPostDoubleHeadersFinalLocationGet", "LROPostDoubleHeadersFinalLocationPost", (req) => {
    return {
      status: 202,
      headers: {
        "Azure-AsyncOperation": `${req.baseUrl}/lro/LROPostDoubleHeadersFinalLocationGet/asyncOperationUrl`,
        "Location": `${req.baseUrl}/lro/LROPostDoubleHeadersFinalLocationGet/location`,
      },
    };
  });

  app.get(
    "/lro/LROPostDoubleHeadersFinalLocationGet/asyncOperationUrl",
    "LROPostDoubleHeadersFinalLocationAsync",
    (req) => {
      return {
        status: 200,
        body: json({
          status: "succeeded",
        }),
      };
    },
  );

  app.get(" /lro/LROPostDoubleHeadersFinalLocationGet/location", "LROPostDoubleHeadersFinalLocationGet", (req) => {
    return {
      status: 200,
      body: json({
        id: "100",
        name: "foo",
      }),
    };
  });
});
