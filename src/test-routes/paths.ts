import { app, ValidationError, json } from "../api";
import { coverageService } from "../services";
const Constants = {
  DEFAULT_SERVER_PORT: "3000",

  MULTIBYTE_BUFFER: "啊齄丂狛狜隣郎隣兀﨩",

  MULTIBYTE_BUFFER_BODY:
    "啊齄丂狛狜隣郎隣兀﨩ˊ〞〡￤℡㈱‐ー﹡﹢﹫、〓ⅰⅹ⒈€㈠㈩ⅠⅫ！￣ぁんァヶΑ︴АЯаяāɡㄅㄩ─╋︵﹄︻︱︳︴ⅰⅹɑɡ〇〾⿻⺁䜣€",
};

const scenarios = {
  bool: {
    name: "Bool",
    scenarios: {
      true: "True",
      false: "False",
    },
  },
  int: {
    name: "Int",
    scenarios: {
      "1000000": { name: "Positive", expectedValue: 1000000 },
      "-1000000": { name: "Negative", expectedValue: -1000000 },
      "1460505600": { name: "UnixTime", expectedValue: 1460505600 },
    },
  },
  long: {
    name: "Long",
    scenarios: {
      "10000000000": { name: "Positive", expectedValue: 10000000000 },
      "-10000000000": { name: "Negative", expectedValue: -10000000000 },
    },
  },
  float: {
    name: "Float",
    scenarios: {
      "1.034E+20": { name: "Positive", expectedValue: 1.034e20 },
      "-1.034E-20": { name: "Negative", expectedValue: -1.034e-20 },
    },
  },
  double: {
    name: "Double",
    scenarios: {
      "9999999.999": { name: "Positive", expectedValue: 9999999.999 },
      "-9999999.999": { name: "Negative", expectedValue: -9999999.999 },
    },
  },
  string: {
    name: "String",
    scenarios: {
      "unicode": { name: "Unicode", expectedValue: Constants.MULTIBYTE_BUFFER },
      "begin!*'();:@ &=+$,/?#[]end": "UrlEncoded",
      "begin!*'();:@&=+$,end": {
        name: "UrlNonEncoded",
        expectedValue: "begin!*'();:@&=+$,end",
      },
      "null": "Null",
      "bG9yZW0": "Base64Url",
    },
  },
  byte: {
    name: "Byte",
    scenarios: {
      multibyte: { name: "MultiByte", expectedValue: Buffer.from(Constants.MULTIBYTE_BUFFER).toString("base64") },
    },
  },
  date: {
    name: "Date",
    scenarios: {
      "2012-01-01": "Valid",
    },
  },
  datetime: {
    name: "DateTime",
    scenarios: {
      "2012-01-01T01:01:01Z": {
        name: "Valid",
        expectedValue: new Date("2012-01-01T01:01:01Z").toISOString(),
      },
    },
  },
  enum: {
    name: "Enum",
    scenarios: {
      "green color": "Valid",
    },
  },
  array: {
    name: "Array",
    scenarios: {
      "ArrayPath1,begin!*'();:@ &=+$,/?#[]end,,": "CSVInPath",
    },
  },
} as const;

type Scenarios = typeof scenarios;

interface ScenarioConfig {
  name: string;
  expectedValue: unknown;
}

app.category("vanilla", () => {
  for (const [type, value] of Object.entries(scenarios)) {
    app.get(`/paths/${type}/empty`, `UrlPaths${value.name}Empty`, (req) => {
      return {
        status: 200,
      };
    });

    for (const scenarioConfig of Object.values<string | ScenarioConfig>(value.scenarios)) {
      const coverageName = `UrlPaths${value.name}${getScenarioName(scenarioConfig)}`;
      coverageService.register("vanilla", coverageName);
    }

    app.get(`/paths/${type}/:scenarioName/:wireParameter`, undefined, (req) => {
      const wireParameter = deserializeValue(type as never, req.params.wireParameter);
      const scenarioName: string = decodeURIComponent(req.params.scenarioName);
      const scenarioConfig: ScenarioConfig = value.scenarios[scenarioName as keyof typeof value.scenarios];
      if (scenarioConfig === undefined) {
        return { status: 404, body: json({ message: `Scenario "${scenarioName}" not found for type ${type}` }) };
      }
      const expectedValue = getScenarioExpectedValue(scenarioName, scenarioConfig);

      if (wireParameter !== expectedValue) {
        throw new ValidationError("wireParameter path does not match expected value", expectedValue, wireParameter);
      }

      coverageService.track("vanilla", `UrlPaths${value.name}${getScenarioName(scenarioConfig)}`);
      return { status: 200 };
    });
  }
});

function deserializeValue<T extends keyof Scenarios>(type: T, value: string) {
  switch (type) {
    case "int":
    case "long":
    case "float":
    case "double":
      return JSON.parse(decodeURIComponent(value));
    default:
      return value;
  }
}

function getScenarioName(scenarioConfig: string | ScenarioConfig) {
  return typeof scenarioConfig === "string" ? scenarioConfig : scenarioConfig.name;
}

function getScenarioExpectedValue(scenarioPath: string, scenarioConfig: string | ScenarioConfig) {
  return typeof scenarioConfig === "string" ? scenarioPath : scenarioConfig.expectedValue;
}
