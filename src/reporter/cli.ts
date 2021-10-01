import { join } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { immediatePush } from "./coverage";

async function main() {
  await yargs(hideBin(process.argv))
    .option("coverageDirectory", {
      description:
        "Path to the folder of the coverage files. Should be $pwd/coverage where $pwd is the directory where autorest.testserver was run from.",
      default: join(process.cwd(), "coverage"),
      type: "string",
    })
    .version(false)
    .option("version", { description: "Version", type: "string" })
    .command(
      "publish",
      "Publish testserver coverage",
      (cmd) => {
        return cmd
          .option("repo", { type: "string", description: "Name of the Github Repo", demandOption: true })
          .option("ref", { type: "string", description: "Ref to the branch/pr.", demandOption: true })
          .option("githubToken", { type: "string", description: "Github token for authentication" })
          .option("azStorageAccount", {
            type: "string",
            description: "Azure storager account name",
            demandOption: true,
          })
          .option("azStorageAccessKey", {
            type: "string",
            description: "Authentication key for storage account",
            demandOption: true,
          });
      },
      (args) => {
        const pr = Number(args.ref.split("/")[2]);
        return immediatePush(
          args.repo,
          pr.toString(),
          args.githubToken ?? "",
          args.azStorageAccount,
          args.azStorageAccessKey,
          args.version,
          args.coverageDirectory,
        );
      },
    )
    .fail(function (msg, err) {
      if (err) {
        throw err;
      }
      // eslint-disable-next-line no-console
      console.log(msg);
      process.exit(1);
    }).argv;
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
