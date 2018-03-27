import { push } from "./coverage";
import { repo, pr, githubToken, azStorageAccount, azStorageAccessKey } from "./cli";

push(repo, pr, githubToken, azStorageAccount, azStorageAccessKey);