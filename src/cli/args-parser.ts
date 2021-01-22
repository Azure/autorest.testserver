import { join } from "path";
import yargs, { CommandModule } from "yargs";
import { CliConfig } from "./cli-config";

export const DEFAULT_PORT = 3000;

export const parseArgs = (argv: string[]): CliConfig => {
  const cli = yargs(argv)
    .help()
    .strict()
    .command("$0", "Run the autorest test server.")
    .command("stop", "Stop the autorest test server running at the provided port.")
    .command("validate-spec-coverage", "Validate there is a mock api for all the path defined in the specs")
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
    });

  const options = cli.argv;
  return {
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    command: (options._[0] as any) ?? "run",
  };
};
