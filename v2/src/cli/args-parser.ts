import yargs from "yargs";
import { CliConfig } from "./cli-config";

export const DEFAULT_PORT = 3000;

export const parseArgs = (argv: string[]): CliConfig => {
  const cli = yargs(argv)
    .help()
    .strict()
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging level.",
    })
    .option("debug", {
      type: "boolean",
      description: "Run with debug logging level.",
    })
    .option("level", {
      type: "string",
      description: "Run with given logging level.",
    })
    .option("port", {
      alias: "p",
      type: "number",
      description: "Port where to host the server",
      default: DEFAULT_PORT,
    });

  const options = cli.argv;
  return {
    ...options,
  };
};
