import { escape } from "querystring";
import { app, json, ValidationError } from "../api";
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
      "1000000": "Positive",
      "-1000000": "Negative",
      "1460505600": "UnixTime",
    },
  },
  long: {
    name: "Long",
    scenarios: {
      "10000000000": "Positive",
      "-10000000000": "Negative",
    },
  },
  float: {
    name: "Float",
    scenarios: {
      "1.034E+20": "Positive",
      "-1.034E-20": "Negative",
    },
  },
  double: {
    name: "Double",
    scenarios: {
      "9999999.999": "Positive",
      "-9999999.999": "Negative",
    },
  },
  string: {
    name: "String",
    scenarios: {
      "unicode": "Unicode",
      "begin!*'();:@ &=+$,/?#[]end": "UrlEncoded",
      "begin!*'();:@&=+$,end": "UrlNonEncoded",
      "null": "Null",
      "bG9yZW0": "Base64Url",
    },
  },
  byte: {
    name: "Byte",
    scenarios: {
      multibyte: "MultiByte",
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
      "2012-01-01T01:01:01Z": "Valid",
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

function validateArrayPath(arrayValue: string, separator: string): boolean {
  return arrayValue === "ArrayPath1" + separator + "begin!*'();:@ &=+$,/?#[]end" + separator + separator;
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

app.category("vanilla", () => {
  for (const [type, value] of Object.entries(scenarios)) {
    app.get(`/paths/${type}/empty`, `UrlPaths${value.name}Empty`, (req) => {
      return {
        status: 200,
      };
    });
    for (const [scenario, scenarioName] of Object.entries(value.scenarios)) {
      const coverageName = `UrlPaths${value.name}${scenarioName}`;
      // Convert the string value to a javascript primtive if possible.

      app.get(`/paths/${type}/${escape(scenario)}/:wireParameter`, coverageName, (req) => {
        const wireParameter = req.params.wireParameter;
        const expectedValue = getExpectedValue(type as never, scenarioName);

        if (scenario !== wireParameter) {
          throw new ValidationError("wireParameter path does not match expected value", expectedValue, wireParameter);
        } else {
          return { status: 200 };
        }
      });
    }
  }
});

function getExpectedValue<T extends keyof typeof scenarios, S extends keyof typeof scenarios[T]["scenarios"]>(
  type: T,
  scenario: S,
) {
  const defaultValue = JSON.parse(`"${scenario}"`);
  switch (type) {
    case "string":
      return scenario === "unicode" ? Constants.MULTIBYTE_BUFFER : defaultValue;
    case "byte":
      return Buffer.from(Constants.MULTIBYTE_BUFFER).toString("base64");
    default:
      return defaultValue;
  }
}
