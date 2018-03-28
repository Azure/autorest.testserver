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

const repo = args[0];
const ref = args[1];
const githubToken = args[2];
const azStorageAccount = args[3];
const azStorageAccessKey = args[4];
if (!repo || !ref || !githubToken) throw "too few arguments";

if (!ref.startsWith("refs/pull")) throw "not a PR";
const pr = ref.split('/')[2];


module.export = {
    repo,
    githubToken,
    azStorageAccount,
    azStorageAccessKey,
    pr
};