import { repo, pr, githubToken } from "./cli";
import { show } from "./coverage";

show(repo, pr, githubToken).catch((x) => {
  // eslint-disable-next-line no-console
  console.error(x);
});
