#!/usr/bin/env node

import { hideBin } from "yargs/helpers";
import { logger, setLoggingLevelFromConfig } from "../logger";
import { parseArgs } from "./args-parser";

const config = parseArgs(hideBin(process.argv));
setLoggingLevelFromConfig(config);
