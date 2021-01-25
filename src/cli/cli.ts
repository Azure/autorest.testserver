#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("source-map-support").install();

import { hideBin } from "yargs/helpers";
import { logger, setLoggingLevelFromConfig } from "../logger";
import { parseArgs } from "./args-parser";
import { stopCommand, runCommand, validateSpecCoverageCommand } from "./commands";

const run = async () => {
  const cliConfig = parseArgs(hideBin(process.argv));
  setLoggingLevelFromConfig(cliConfig);
  switch (cliConfig.command) {
    case "run":
      await runCommand(cliConfig);
      break;
    case "stop":
      await stopCommand(cliConfig);
      break;
    case "validate-spec-coverage":
      await validateSpecCoverageCommand(cliConfig);
      break;
  }
};

run().catch((e) => {
  logger.error("Error", e);
  process.exit(1);
});
