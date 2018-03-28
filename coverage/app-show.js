const { show } = require("./coverage");
const { repo, pr, githubToken, azStorageAccount, azStorageAccessKey } = require("./cli");

show(repo, pr, githubToken)
    .catch(x => { console.error(x); process.exit(1); });