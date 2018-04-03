const { push } = require("./coverage");
const { repo, pr, githubToken, azStorageAccount, azStorageAccessKey } = require("./cli");

push(repo, pr, githubToken, azStorageAccount, azStorageAccessKey)
    .catch(x => { console.error(x); });