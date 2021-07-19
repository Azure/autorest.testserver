import { repo, pr, githubToken, azStorageAccount, azStorageAccessKey } from "./cli";
import { push } from "./coverage";

push(repo, pr, githubToken, azStorageAccount, azStorageAccessKey).catch((x) => {
  // eslint-disable-next-line no-console
  console.error(x);
});
