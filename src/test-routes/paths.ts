import { app, json, ValidationError } from "../api";

const Constants = {
  DEFAULT_SERVER_PORT: "3000",

  MULTIBYTE_BUFFER: "啊齄丂狛狜隣郎隣兀﨩",

  MULTIBYTE_BUFFER_BODY:
    "啊齄丂狛狜隣郎隣兀﨩ˊ〞〡￤℡㈱‐ー﹡﹢﹫、〓ⅰⅹ⒈€㈠㈩ⅠⅫ！￣ぁんァヶΑ︴АЯаяāɡㄅㄩ─╋︵﹄︻︱︳︴ⅰⅹɑɡ〇〾⿻⺁䜣€",
};

const scenarioMap = {
  "true": "True",
  "false": "False",
  "1000000": "Positive",
  "-1000000": "Negative",
  "10000000000": "Positive",
  "-10000000000": "Negative",
  "1.034E+20": "Positive",
  "-1.034E-20": "Negative",
  "9999999.999": "Positive",
  "-9999999.999": "Negative",
  "begin!*'();:@ &=+$,/?#[]end": "UrlEncoded",
  "begin!*'();:@&=+$,end": "UrlNonEncoded",
  "multibyte": "MultiByte",
  "empty": "Empty",
  "null": "Null",
  "2012-01-01": "Valid",
  "2012-01-01T01:01:01Z": "Valid",
  "green color": "Valid",
  "bG9yZW0": "Base64Url",
  "1460505600": "UnixTime",
  "ArrayPath1,begin!*'();:@ &=+$,/?#[]end,,": "CSVInPath",
  "unicode": "Unicode",
};

const typeMap = {
  bool: "Bool",
  int: "Int",
  long: "Long",
  float: "Float",
  double: "Double",
  string: "String",
  byte: "Byte",
  date: "Date",
  datetime: "DateTime",
  enum: "Enum",
  array: "Array",
};

const typeNames: Array<keyof typeof typeMap> = Object.keys(typeMap) as never;
const scenarioNames: Array<keyof typeof scenarioMap> = Object.keys(scenarioMap) as never;

function getScenarioName(type: keyof typeof typeMap, scenario: keyof typeof scenarioMap): string | undefined {
  const parsedType = typeMap[type];
  const parsedScenario = scenarioMap[scenario];
  return parsedType + parsedScenario;
}

function validateArrayPath(arrayValue: string, separator: string): boolean {
  return arrayValue === "ArrayPath1" + separator + "begin!*'();:@ &=+$,/?#[]end" + separator + separator;
}

app.category("vanilla", () => {
  for (const type of typeNames) {
    for (const scenario of scenarioNames) {
      const coverageName = getScenarioName(type as keyof typeof typeMap, scenario);

      if (scenario === "empty") {
        app.get(`/paths/${type}/empty`, `UrlPaths${coverageName}`, (req) => {
          return {
            status: 200,
          };
        });
      } else {
        app.get(`/paths/${type}/${scenario}/:wireParameter`, ``, (req) => {
          const wireParameter = req.params.wireParameter;
          const bytes = Buffer.from(Constants.MULTIBYTE_BUFFER);

          if (type === "string") {
            const expectedValue = scenario === "unicode" ? Constants.MULTIBYTE_BUFFER : scenario;
            if (wireParameter === expectedValue) {
              return { status: 200 };
            } else {
              throw new ValidationError(
                "wireParameter path does not match expected value",
                expectedValue,
                wireParameter,
              );
            }
          } else if (type === "array") {
            if (scenario === wireParameter && validateArrayPath(wireParameter, ",")) {
              return { status: 200 };
            } else {
              throw new ValidationError("wireParameter path does not match expected value", scenario, wireParameter);
            }
          } else if (type === "enum") {
            if (scenario === wireParameter) {
              return { status: 200 };
            } else {
              throw new ValidationError("wireParameter path does not match expected value", scenario, wireParameter);
            }
          } else if (type === "byte") {
            if (scenario === "multibyte" && wireParameter === bytes.toString("base64")) {
              return { status: 200 };
            } else {
              throw new ValidationError(
                "wireParameter path does not match expected value",
                bytes.toString("base64"),
                wireParameter,
              );
            }
          } else if (type === "datetime") {
            if (wireParameter === scenario) {
              return { status: 200 };
            } else {
              throw new ValidationError("wireParameter path does not match expected value", scenario, wireParameter);
            }
          } else if (scenario !== wireParameter) {
            throw new ValidationError("wireParameter path does not match expected value", scenario, wireParameter);
          } else {
            return { status: 200 };
          }
        });
      }
    }
  }
});
