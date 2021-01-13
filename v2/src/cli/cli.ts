#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("source-map-support").install();

import { hideBin } from "yargs/helpers";
import { ApiMockApp, ApiMockAppConfig } from "../app";
import { logger, setLoggingLevelFromConfig } from "../logger";
import { parseArgs } from "./args-parser";
import { CliConfig } from "./cli-config";

const getAppConfig = (cliConfig: CliConfig): ApiMockAppConfig => {
  return {
    port: cliConfig.port,
    include: cliConfig.include,
  };
};

const run = async () => {
  const cliConfig = parseArgs(hideBin(process.argv));
  setLoggingLevelFromConfig(cliConfig);
  const app = new ApiMockApp(getAppConfig(cliConfig));
  await app.start();
};

run().catch((e) => {
  logger.error("Error", e);
  process.exit(1);
});
