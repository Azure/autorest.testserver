import { app, json } from "../api";

app.category("vanilla", () => {
  app.put("/additionalProperties/true", "additionalPropertiesTrue", (req) => {
    const expectedBody = {
      id: 1,
      name: "Puppy",
      birthdate: "2017-12-13T02:29:51Z",
      complexProperty: {
        color: "Red",
      },
    };

    req.expect.coercedBodyEquals(expectedBody);
    return {
      status: 200,
      body: json({ ...expectedBody, status: true }),
    };
  });

  app.put("/additionalProperties/true-subclass", "additionalPropertiesSubclass", (req) => {
    const expectedBody = {
      id: 1,
      name: "Lisa",
      friendly: true,
      birthdate: "2017-12-13T02:29:51Z",
      complexProperty: {
        color: "Red",
      },
    };

    req.expect.coercedBodyEquals(expectedBody);
    return {
      status: 200,
      body: json({ ...expectedBody, status: true }),
    };
  });

  app.put("/additionalProperties/type/object", "additionalPropertiesTypeObject", (req) => {
    const expectedBody = {
      id: 2,
      name: "Hira",
      siblings: [
        {
          id: 1,
          name: "Puppy",
          birthdate: "2017-12-13T02:29:51Z",
          complexProperty: {
            color: "Red",
          },
        },
      ],
      picture: new Buffer([255, 255, 255, 255, 254]).toString("base64"),
    };

    req.expect.coercedBodyEquals(expectedBody);    
    return {
      status: 200,
      body: json({ ...expectedBody, status: true }),
    };
  });

  app.put("/additionalProperties/type/string", "additionalPropertiesTypeString", (req) => {
    const expectedBody = {
      id: 3,
      name: "Tommy",
      color: "red",
      weight: "10 kg",
      city: "Bombay",
    };

    req.expect.bodyEquals(expectedBody);
    return {
      status: 200,
      body: json({ ...expectedBody, status: true }),
    };
  });

  app.put("/additionalProperties/in/properties", "additionalPropertiesInProperties", (req) => {
    const expectedBody = {
      id: 4,
      name: "Bunny",
      additionalProperties: {
        height: 5.61,
        weight: 599,
        footsize: 11.5,
      },
    };

    req.expect.bodyEquals(expectedBody);
    return {
      status: 200,
      body: json({ ...expectedBody, status: true }),
    };
  });

  app.put(
    "/additionalProperties/in/properties/with/additionalProperties/string",
    "additionalPropertiesInPropertiesWithAPTypeString",
    (req) => {
      const expectedBody = {
        "id": 5,
        "name": "Funny",
        "@odata.location": "westus",
        "additionalProperties": {
          height: 5.61,
          weight: 599,
          footsize: 11.5,
        },
        "color": "red",
        "city": "Seattle",
        "food": "tikka masala",
      };

      req.expect.bodyEquals(expectedBody);
      return {
        status: 200,
        body: json({ ...expectedBody, status: true }),
      };
    },
  );
});
