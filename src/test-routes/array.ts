import { app, json } from "../api";

app.category("vanilla", () => {
  app.put("/array/empty", "putArrayEmpty", async (req) => {
    req.expect.bodyEquals([]);
    return { status: 200 };
  });

  app.get("/array/empty", "getArrayEmpty", (req) => {
    return { status: 200, body: json([]) };
  });

  app.get("/array/null", "getArrayNull", (req) => {
    return { status: 200 };
  });

  app.get("/array/invalid", "getArrayInvalid", (req) => {
    return { status: 200, body: { rawContent: "[1, 2, 3", contentType: "application/json" } };
  });

  //#region boolean
  app.get("/array/prim/boolean/tfft", "getArrayBooleanValid", (req) => {
    return { status: 200, body: json([true, false, false, true]) };
  });

  app.put("/array/prim/boolean/tfft", "putArrayBooleanValid", (req) => {
    req.expect.bodyEquals([true, false, false, true]);
    return { status: 200 };
  });

  app.get("/array/prim/boolean/true.null.false", "getArrayBooleanWithNull", (req) => {
    return { status: 200, body: json([true, null, false]) };
  });

  app.get("/array/prim/boolean/true.boolean.false", "getArrayBooleanWithString", (req) => {
    return { status: 200, body: json([true, "boolean", false]) };
  });
  //#endregion

  //#region integer
  app.get("/array/prim/integer/1.\\-1.3.300", "getArrayIntegerValid", (req) => {
    return { status: 200, body: json([1, -1, 3, 300]) };
  });

  app.put("/array/prim/integer/1.\\-1.3.300", "putArrayIntegerValid", (req) => {
    req.expect.bodyEquals([1, -1, 3, 300]);
    return { status: 200 };
  });

  app.get("/array/prim/integer/1.null.zero", "getArrayIntegerWithNull", (req) => {
    return { status: 200, body: json([1, null, 0]) };
  });
  //#endregion

  app.get("/array/prim/integer/1.integer.0", "getArrayIntegerWithString", (req) => {
    return { status: 200, body: json([1, "integer", 0]) };
  });

  //#region long
  app.get("/array/prim/long/1.\\-1.3.300", "getArrayLongValid", (req) => {
    return { status: 200, body: json([1, -1, 3, 300]) };
  });

  app.put("/array/prim/long/1.\\-1.3.300", "putArrayLongValid", (req) => {
    req.expect.bodyEquals([1, -1, 3, 300]);
    return { status: 200 };
  });

  app.get("/array/prim/long/1.null.zero", "getArrayLongWithNull", (req) => {
    return { status: 200, body: json([1, null, 0]) };
  });

  app.get("/array/prim/long/1.integer.0", "getArrayLongWithString", (req) => {
    return { status: 200, body: json([1, "integer", 0]) };
  });
  //#endregion

  //#region float
  app.get("/array/prim/float/0\\-\\-0.01\\-1.2e20", "getArrayFloatValid", (req) => {
    return { status: 200, body: json([0, -0.01, -1.2e20]) };
  });

  app.put("/array/prim/float/0\\-\\-0.01\\-1.2e20", "putArrayFloatValid", (req) => {
    req.expect.bodyEquals([0, -0.01, -1.2e20]);
    return { status: 200 };
  });

  app.get("/array/prim/float/0.0\\-null\\-1.2e20", "getArrayFloatWithNull", (req) => {
    return { status: 200, body: json([0.0, null, -1.2e20]) };
  });

  app.get("/array/prim/float/1.number.0", "getArrayFloatWithString", (req) => {
    return { status: 200, body: json([1, "number", 0]) };
  });
  //#endregion

  //#region double
  app.get("/array/prim/double/0\\-\\-0.01\\-1.2e20", "getArrayDoubleValid", (req) => {
    return { status: 200, body: json([0, -0.01, -1.2e20]) };
  });

  app.put("/array/prim/double/0\\-\\-0.01\\-1.2e20", "putArrayDoubleValid", (req) => {
    req.expect.bodyEquals([0, -0.01, -1.2e20]);
    return { status: 200 };
  });

  app.get("/array/prim/double/0.0\\-null\\-1.2e20", "getArrayDoubleWithNull", (req) => {
    return { status: 200, body: json([0.0, null, -1.2e20]) };
  });

  app.get("/array/prim/double/1.number.0", "getArrayDoubleWithString", (req) => {
    return { status: 200, body: json([1, "number", 0]) };
  });
  //#endregion

  //#region string
  app.get("/array/prim/string/foo1.foo2.foo3", "getArrayStringValid", (req) => {
    return { status: 200, body: json(["foo1", "foo2", "foo3"]) };
  });

  app.put("/array/prim/string/foo1.foo2.foo3", "putArrayStringValid", (req) => {
    req.expect.bodyEquals(["foo1", "foo2", "foo3"]);
    return { status: 200 };
  });

  app.get("/array/prim/string/foo.null.foo2", "getArrayStringWithNull", (req) => {
    return { status: 200, body: json(["foo", null, "foo2"]) };
  });

  app.get("/array/prim/string/foo.123.foo2", "getArrayStringWithString", (req) => {
    return { status: 200, body: json(["foo", 123, "foo2"]) };
  });
  //#endregion

  //#region enum
  app.get("/array/prim/enum/foo1.foo2.foo3", "getArrayEnumValid", (req) => {
    return { status: 200, body: json(["foo1", "foo2", "foo3"]) };
  });

  app.put("/array/prim/enum/foo1.foo2.foo3", "putArrayEnumValid", (req) => {
    req.expect.bodyEquals(["foo1", "foo2", "foo3"]);
    return { status: 200 };
  });
  app.get("/array/prim/string-enum/foo1.foo2.foo3", "getArrayStringEnumValid", (req) => {
    return { status: 200, body: json(["foo1", "foo2", "foo3"]) };
  });

  app.put("/array/prim/string-enum/foo1.foo2.foo3", "putArrayStringEnumValid", (req) => {
    req.expect.bodyEquals(["foo1", "foo2", "foo3"]);
    return { status: 200 };
  });
  //#endregion

  //#region uuid
  app.get("/array/prim/uuid/valid", "getArrayUuidValid", (req) => {
    return {
      status: 200,
      body: json([
        "6dcc7237-45fe-45c4-8a6b-3a8a3f625652",
        "d1399005-30f7-40d6-8da6-dd7c89ad34db",
        "f42f6aa1-a5bc-4ddf-907e-5f915de43205",
      ]),
    };
  });

  app.put("/array/prim/uuid/valid", "putArrayUuidValid", (req) => {
    req.expect.bodyEquals([
      "6dcc7237-45fe-45c4-8a6b-3a8a3f625652",
      "d1399005-30f7-40d6-8da6-dd7c89ad34db",
      "f42f6aa1-a5bc-4ddf-907e-5f915de43205",
    ]);
    return { status: 200 };
  });

  app.get("/array/prim/uuid/invalidchars", "getArrayUuidWithInvalidChars", (req) => {
    return {
      status: 200,
      body: json(["6dcc7237-45fe-45c4-8a6b-3a8a3f625652", "foo"]),
    };
  });
  //#endregion

  //#region date
  app.get("/array/prim/date/valid", "getArrayDateValid", (req) => {
    return {
      status: 200,
      body: json(["2000-12-01", "1980-01-02", "1492-10-12"]),
    };
  });

  app.put("/array/prim/date/valid", "putArrayDateValid", (req) => {
    req.expect.bodyEquals(["2000-12-01", "1980-01-02", "1492-10-12"]);
    return { status: 200 };
  });

  app.get("/array/prim/date/invalidnull", "getArrayDateWithNull", (req) => {
    return {
      status: 200,
      body: json(["2012-01-01", null, "1776-07-04"]),
    };
  });
  app.get("/array/prim/date/invalidchars", "getArrayDateWithInvalidChars", (req) => {
    return {
      status: 200,
      body: json(["2011-03-22", "date"]),
    };
  });
  //#endregion

  //#region date-time
  app.get("/array/prim/date-time/valid", "getArrayDateTimeValid", (req) => {
    return {
      status: 200,
      body: json(["2000-12-01t00:00:01z", "1980-01-02T00:11:35+01:00", "1492-10-12T10:15:01-08:00"]),
    };
  });

  app.put("/array/prim/date-time/valid", "putArrayDateTimeValid", (req) => {
    req.expect.bodyEquals(["2000-12-01T00:00:01.000Z", "1980-01-02T00:11:35.000Z", "1492-10-12T10:15:01.000Z"]);
    return { status: 200 };
  });

  app.get("/array/prim/date-time/invalidnull", "getArrayDateTimeWithNull", (req) => {
    return {
      status: 200,
      body: json(["2000-12-01T00:00:01.000Z", null]),
    };
  });

  app.get("/array/prim/date-time/invalidchars", "getArrayDateTimeWithInvalidChars", (req) => {
    return {
      status: 200,
      body: json(["2000-12-01t00:00:01z", "date-time"]),
    };
  });
  //#endregion

  //#region date-time-rfc1123
  app.get("/array/prim/date-time-rfc1123/valid", "getArrayDateTimeRfc1123Valid", (req) => {
    return {
      status: 200,
      body: json(["Fri, 01 Dec 2000 00:00:01 GMT", "Wed, 02 Jan 1980 00:11:35 GMT", "Wed, 12 Oct 1492 10:15:01 GMT"]),
    };
  });

  app.put("/array/prim/date-time-rfc1123/valid", "getDateTimeRfc1123Valid", (req) => {
    req.expect.bodyEquals([
      "Fri, 01 Dec 2000 00:00:01 GMT",
      "Wed, 02 Jan 1980 00:11:35 GMT",
      "Wed, 12 Oct 1492 10:15:01 GMT",
    ]);
    return { status: 200 };
  });
  //#endregion

  //#region duration
  app.get("/array/prim/duration/valid", "getArrayDurationValid", (req) => {
    return {
      status: 200,
      body: json(["P123DT22H14M12.011S", "P5DT1H0M0S"]),
    };
  });

  app.put("/array/prim/duration/valid", "putArrayDurationValid", (req) => {
    req.expect.bodyEquals(["P123DT22H14M12.011S", "P5DT1H"]);
    return { status: 200 };
  });
  //#endregion

  //#region byte
  app.get("/array/prim/byte/valid", "getArrayByteValid", (req) => {
    return {
      status: 200,
      body: json([
        Buffer.from([255, 255, 255, 250]).toString("base64"),
        Buffer.from([1, 2, 3]).toString("base64"),
        Buffer.from([37, 41, 67]).toString("base64"),
      ]),
    };
  });

  app.put("/array/prim/byte/valid", "putArrayByteValid", (req) => {
    req.expect.bodyEquals([
      Buffer.from([255, 255, 255, 250]).toString("base64"),
      Buffer.from([1, 2, 3]).toString("base64"),
      Buffer.from([37, 41, 67]).toString("base64"),
    ]);
    return { status: 200 };
  });

  app.get("/array/prim/byte/invalidnull", "getArrayByteWithNull", (req) => {
    return {
      status: 200,
      body: json([Buffer.from([171, 172, 173]).toString("base64"), null]),
    };
  });
  //#endregion

  //#region base64url
  app.get("/array/prim/base64url/valid", "getArrayBase64Url", (req) => {
    return {
      status: 200,
      body: json(["YSBzdHJpbmcgdGhhdCBnZXRzIGVuY29kZWQgd2l0aCBiYXNlNjR1cmw", "dGVzdCBzdHJpbmc", "TG9yZW0gaXBzdW0"]),
    };
  });
  //#endregion

  //#region complex
  app.get("/array/complex/null", "getArrayComplexNull", (req) => {
    return {
      status: 200,
    };
  });

  app.get("/array/complex/empty", "getArrayComplexEmpty", (req) => {
    return {
      status: 200,
      body: json([]),
    };
  });
  app.get("/array/complex/itemnull", "getArrayComplexItemNull", (req) => {
    return {
      status: 200,
      body: json([{ integer: 1, string: "2" }, null, { integer: 5, string: "6" }]),
    };
  });
  app.get("/array/complex/itemempty", "getArrayComplexItemEmpty", (req) => {
    return {
      status: 200,
      body: json([{ integer: 1, string: "2" }, {}, { integer: 5, string: "6" }]),
    };
  });
  app.get("/array/complex/valid", "getArrayComplexValid", (req) => {
    return {
      status: 200,
      body: json([
        { integer: 1, string: "2" },
        { integer: 3, string: "4" },
        { integer: 5, string: "6" },
      ]),
    };
  });
  app.put("/array/complex/valid", "putArrayComplexValid", (req) => {
    req.expect.bodyEquals([
      { integer: 1, string: "2" },
      { integer: 3, string: "4" },
      { integer: 5, string: "6" },
    ]);
    return { status: 200 };
  });
  //#endregion

  //#region array
  app.get("/array/array/null", "getArrayArrayNull", (req) => {
    return {
      status: 200,
    };
  });

  app.get("/array/array/empty", "getArrayArrayEmpty", (req) => {
    return {
      status: 200,
      body: json([]),
    };
  });
  app.get("/array/array/itemnull", "getArrayArrayItemNull", (req) => {
    return {
      status: 200,
      body: json([["1", "2", "3"], null, ["7", "8", "9"]]),
    };
  });
  app.get("/array/array/itemempty", "getArrayArrayItemEmpty", (req) => {
    return {
      status: 200,
      body: json([["1", "2", "3"], [], ["7", "8", "9"]]),
    };
  });
  app.get("/array/array/valid", "getArrayArrayValid", (req) => {
    return {
      status: 200,
      body: json([
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
      ]),
    };
  });
  app.put("/array/array/valid", "putArrayArrayValid", (req) => {
    req.expect.bodyEquals([
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ]);
    return { status: 200 };
  });
  //#endregion

  //#region dictionary
  app.get("/array/dictionary/null", "getArrayDictionaryNull", (req) => {
    return {
      status: 200,
    };
  });

  app.get("/array/dictionary/empty", "getArrayDictionaryEmpty", (req) => {
    return {
      status: 200,
      body: json([]),
    };
  });
  app.get("/array/dictionary/itemnull", "getArrayDictionaryItemNull", (req) => {
    return {
      status: 200,
      body: json([{ "1": "one", "2": "two", "3": "three" }, null, { "7": "seven", "8": "eight", "9": "nine" }]),
    };
  });
  app.get("/array/dictionary/itemempty", "getArrayDictionaryItemEmpty", (req) => {
    return {
      status: 200,
      body: json([{ "1": "one", "2": "two", "3": "three" }, {}, { "7": "seven", "8": "eight", "9": "nine" }]),
    };
  });
  app.get("/array/dictionary/valid", "getArrayDictionaryValid", (req) => {
    return {
      status: 200,
      body: json([
        { "1": "one", "2": "two", "3": "three" },
        { "4": "four", "5": "five", "6": "six" },
        { "7": "seven", "8": "eight", "9": "nine" },
      ]),
    };
  });
  app.put("/array/dictionary/valid", "putArrayDictionaryValid", (req) => {
    req.expect.bodyEquals([
      { "1": "one", "2": "two", "3": "three" },
      { "4": "four", "5": "five", "6": "six" },
      { "7": "seven", "8": "eight", "9": "nine" },
    ]);
    return { status: 200 };
  });
  //#endregion
});
