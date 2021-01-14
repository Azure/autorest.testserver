import { app, json } from "../../api";

app.category("azure", () => {
  // Initial call is 202 with no body and Location and Azure-AsyncOperation
  // Configured to follow Location
  // Then, should poll Azure-AsyncOperation and see it's done
  // Then, should do final GET on the initial Location
  // ARM guidance ok, and implemented in VM capture after 2018-04-01
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

  app.get("/lro/LROPostDoubleHeadersFinalLocationGet/location", "LROPostDoubleHeadersFinalLocationGet", (req) => {
    return {
      status: 200,
      body: json({
        id: "100",
        name: "foo",
      }),
    };
  });
});
