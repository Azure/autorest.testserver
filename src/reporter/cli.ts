/**
 * Call as:
 *
 * node
 *    <script>
 *    <repo, e.g. "Azure/autorest.csharp">
 *    <ref, e.g. "refs/pull/2876/merge">
 *    <github token (for coverage comment)>
 *    [<AZ storage user (for coverage push)>]
 *    [<AZ storage pass (for coverage push)>]
 */

const args = process.argv.slice(2);

export const repo = args[0];
const ref = args[1];
export const githubToken = args[2];
export const azStorageAccount = args[3];
export const azStorageAccessKey = args[4];
export const version = args[5];
export const coveragePath = args[6];

// eslint-disable-next-line no-console
console.log(`Looking for coverage in '${coveragePath}'`);
if (!repo || !ref || !githubToken) throw "too few arguments";

export const pr = Number(ref.split("/")[2]);

import { join } from "path";
import yargs from "yargs";
import { immediatePush } from "./coverage";

async function main() {
  await yargs
    .option("coveragePath", {
      description:
        "Path to the folder of the coverage files. Should be $pwd/coverage where $pwd is the directory where autorest.testserver was run from.",
      default: join(process.cwd(), "coverage"),
      type: "string",
    })
    .option("version", { description: "Version", type: "string" })
    .command(
      "publish",
      "Publish testserver coverage",
      (cmd) => {
        return cmd
          .option("repo", { type: "string", description: "Name of the Github Repo", demandOption: true })
          .option("ref", { type: "string", description: "Ref to the Pr if applicable." })
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
        const pr = Number(ref.split("/")[2]);
        return immediatePush(
          args.repo,
          pr.toString(),
          args.githubToken ?? "",
          args.azStorageAccount,
          args.azStorageAccessKey,
          args.version,
          args.coveragePath,
        );
      },
    ).argv;
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
