import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/xml/bytes", "XmlGetBytes", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/xml",
        rawContent: "<ModelWithByteProperty><Bytes>SGVsbG8gd29ybGQ=</Bytes></ModelWithByteProperty>",
      },
    };
  });

  app.put("/xml/bytes", "XmlPutBytes", async (req) => {
    await req.expect.xmlBodyEquals("<ModelWithByteProperty><Bytes>SGVsbG8gd29ybGQ=</Bytes></ModelWithByteProperty>");
    return { status: 201 };
  });

  app.get("/xml/url", "XmlGetUrl", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/xml",
        rawContent: "<ModelWithUrlProperty><Url>https://myaccount.blob.core.windows.net/</Url></ModelWithUrlProperty>",
      },
    };
  });

  app.put("/xml/url", "XmlPutUrl", async (req) => {
    await req.expect.xmlBodyEquals(
      "<ModelWithUrlProperty><Url>https://myaccount.blob.core.windows.net/</Url></ModelWithUrlProperty>",
    );
    return { status: 201 };
  });
});
