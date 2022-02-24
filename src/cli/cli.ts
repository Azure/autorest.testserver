#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("source-map-support").install();

import { join } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { logger, setLoggingLevelFromConfig } from "../logger";
import { stopCommand, runCommand, validateSpecCoverageCommand } from "./commands";

export const DEFAULT_PORT = 3000;

const run = async () => {
  await yargs(hideBin(process.argv))
    .help()
    .strict()
    .env("AUTOREST_TESTSERVER")
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
    })
    .option("coverageDirectory", {
      type: "string",
      description: "Path of the directory where the coverage reports should be saved.",
      default: join(process.cwd(), "coverage"),
    })
    .middleware((args) => {
      setLoggingLevelFromConfig(args);
      return args;
    })
    .command(
      ["$0", "run"],
      "Run the autorest test server.",
      (cmd) =>
        cmd.option("appendCoverage", {
          type: "boolean",
          description: "Load the existing coverage reports and append to it instead of starting fresh.",
        }),
      (args) => runCommand(args),
    )
    .command(
      "stop",
      "Stop the autorest test server running at the provided port.",
      () => null,
      (args) => stopCommand(args),
    )
    .command(
      "validate-spec-coverage",
      "Validate there is a mock api for all the path defined in the specs",
      () => null,
      (args) => validateSpecCoverageCommand(args),
    ).argv;
};

run().catch((e) => {
  logger.error("Error", e);
  process.exit(1);
});
