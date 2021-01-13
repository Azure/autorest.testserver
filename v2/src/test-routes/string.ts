import { app, json } from "../api";

app.category("vanilla", () => {
  app.get("/string/null", "getStringNull", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: undefined,
      },
    };
  });
  app.put("/string/null", "putStringNull", (req) => {
    req.rawBodyEquals(undefined);
    return { status: 200 };
  });

  app.get("/string/empty", "getStringEmpty", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: `""`,
      },
    };
  });

  app.put("/string/empty", "putStringEmpty", (req) => {
    req.rawBodyEquals(`""`);
    return { status: 200 };
  });

  app.get("/string/notProvided", "getNotProvided", (req) => {
    return {
      status: 200,
    };
  });

  app.get("/string/whitespace", "getStringWithLeadingAndTrailingWhitespace", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: '"    Now is the time for all good men to come to the aid of their country    "',
      },
    };
  });

  app.put("/string/whitespace", "putStringWithLeadingAndTrailingWhitespace", (req) => {
    req.rawBodyEquals('"    Now is the time for all good men to come to the aid of their country    "');
    return { status: 200 };
  });

  app.get("/string/base64UrlEncoding", "getStringBase64UrlEncoded", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: '"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjR1cmw"',
      },
    };
  });

  app.put("/string/base64UrlEncoding", "putStringBase64UrlEncoded", (req) => {
    req.rawBodyEquals('"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjR1cmw"');
    return { status: 200 };
  });

  app.get("/string/base64Encoding", "getStringBase64Encoded", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: '"YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjQ="',
      },
    };
  });

  app.get("/string/nullBase64UrlEncoding", "getStringNullBase64UrlEncoding", (req) => {
    return { status: 200 };
  });

  const MULTIBYTE_BUFFER_BODY =
    "啊齄丂狛狜隣郎隣兀﨩ˊ〞〡￤℡㈱‐ー﹡﹢﹫、〓ⅰⅹ⒈€㈠㈩ⅠⅫ！￣ぁんァヶΑ︴АЯаяāɡㄅㄩ─╋︵﹄︻︱︳︴ⅰⅹɑɡ〇〾⿻⺁䜣€";

  app.get("/string/mbcs", "getStringMultiByteCharacters", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: `"${MULTIBYTE_BUFFER_BODY}"`,
      },
    };
  });

  app.put("/string/mbcs", "putStringMultiByteCharacters", (req) => {
    req.bodyEquals(MULTIBYTE_BUFFER_BODY);
    return { status: 200 };
  });

  app.get("/string/enum/notExpandable", "getEnumNotExpandable", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: '"red color"',
      },
    };
  });

  app.put("/string/enum/notExpandable", "putEnumNotExpandable", (req) => {
    req.rawBodyEquals('"red color"');
    return { status: 200 };
  });

  app.get("/string/enum/Referenced", "getEnumReferenced", (req) => {
    return {
      status: 200,
      body: {
        contentType: "application/json",
        rawContent: '"red color"',
      },
    };
  });

  app.put("/string/enum/Referenced", "petEnumReferenced", (req) => {
    req.rawBodyEquals('"red color"');
    return { status: 200 };
  });

  app.get("/string/enum/ReferencedConstant", "getEnumReferencedConstant", (req) => {
    return {
      status: 200,
      body: json({ field1: "Sample String" }),
    };
  });

  app.put("/string/enum/ReferencedConstant", "petEnumReferencedConstant", (req) => {
    req.bodyEquals({ ColorConstant: "green-color" });
    return { status: 200 };
  });
});
