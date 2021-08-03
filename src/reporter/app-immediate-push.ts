import { repo, pr, githubToken, azStorageAccount, azStorageAccessKey, version } from "./cli";
import { immediatePush } from "./coverage";

Promise.resolve()
  .then((_) => immediatePush(repo, pr.toString(), githubToken, azStorageAccount, azStorageAccessKey, version))
  .catch((x) => {
    // eslint-disable-next-line no-console
    console.error(x);
  });
