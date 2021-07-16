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
if (!repo || !ref || !githubToken) throw "too few arguments";

export const pr = ref.split("/")[2];
