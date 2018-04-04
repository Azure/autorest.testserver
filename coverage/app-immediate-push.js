const { immediatePush } = require("./coverage");
const { repo, pr, githubToken, azStorageAccount, azStorageAccessKey } = require("./cli");

Promise.resolve()
    .then(_ => immediatePush(repo, pr, azStorageAccount, azStorageAccessKey))
    .catch(x => { console.error(x); });