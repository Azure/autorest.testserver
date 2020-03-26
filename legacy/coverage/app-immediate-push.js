const { immediatePush } = require("./coverage");
const { repo, pr, githubToken, azStorageAccount, azStorageAccessKey, version } = require("./cli");

Promise.resolve()
    .then(_ => immediatePush(repo, pr, githubToken, azStorageAccount, azStorageAccessKey, version))
    .catch(x => { console.error(x); });
