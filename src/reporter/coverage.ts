/* eslint-disable no-console */
import { execSync } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";
import { createBlobService } from "azure-storage";
import { GitHubCiClient } from "./github";

const GithubCommentHeader = "<!--AUTO-GENERATED PUBLISH JOB COMMENT-->\n";
const ReportHeader = "<!--AUTO-GENERATED TESTSERVER COVERAGE COMMENT-->\n";

export interface CategorySummary {
  covered: number;
  total: number;
}

export interface CoverageReport {
  summary: Record<string, CategorySummary>;
  report: string;
}

async function collectCoverage(coverageFolder: string): Promise<CoverageReport> {
  // search for reports
  const getMergedReport = (category: string) => {
    const reports = readdirSync(coverageFolder)
      .filter((f) => f.startsWith(`report-${category}`) && f.endsWith(".json"))
      .map((f) => require(join(coverageFolder, f)));
    const result: Record<string, number> = {};
    for (const feature of reports.flatMap((r) => Object.keys(r))) {
      result[feature] = Math.max(...reports.map((r) => r[feature] || 0));
    }
    return result;
  };

  const reports: Record<string, Record<string, number>> = {
    General: getMergedReport("vanilla"),
    Azure: getMergedReport("azure"),
    Optional: getMergedReport("optional"),
    DPG: getMergedReport("dpg"),
  };

  if (Object.keys(reports).every((cat) => Object.keys(reports[cat]).length === 0)) {
    const cats = Object.keys(reports).join(", ");
    throw new Error(`No report found in coverage folder '${coverageFolder}' for any of the categories: ${cats}`);
  }

  // post report
  let comment = "";
  const summary: Record<string, CategorySummary> = {};
  for (const category of Object.keys(reports)) {
    const categoryObject = reports[category];
    const features = Object.keys(categoryObject)
      .sort()
      .map((x) => [x, categoryObject[x] > 0]);
    const countTotal = features.length;
    const countCovered = features.filter((x) => x[1]).length;
    const countMissing = countTotal - countCovered;
    summary[category] = {
      covered: countCovered,
      total: countTotal,
    };
    const percentCoverage = ((countCovered / (countTotal || 1)) * 100) | 0;
    comment += `## ${percentCoverage === 100 ? "✔️" : "❌️"} ${category}: ${percentCoverage}%\n\n`;
    if (countMissing > 0) {
      comment += `<details><summary>${countMissing} out of ${countTotal} features are not covered by tests</summary><p>\n\n`;
      let first = true;
      for (const feature of features.filter((x) => !x[1])) {
        if (!first) comment += `, `;
        first = false;

        const f = feature[0];
        comment += `[\`${f}\`](https://github.com/Azure/autorest.testserver/search?q=${f})`;
      }
      comment += "</p></details>";
    } else if (countTotal === 0) {
      comment += `no tests were run for this category\n`;
    }
    comment += "\n\n";
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testServerVersion = require(join(__dirname, "..", "..", "package.json")).version;
  const report = `${ReportHeader}# 🤖 AutoRest automatic feature coverage report 🤖\n*feature set version ${testServerVersion}*\n\n${comment}`;

  return {
    summary,
    report,
  };
}

function getPublishedPackageVersion() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(join(__dirname, "..", "..", "..", "..", "..", "package.json")).version;
}

async function pushCoverage(
  repo: string,
  ref: string,
  azStorageAccount: string,
  azStorageAccessKey: string,
  comment: string,
  version?: string,
) {
  if (!version) {
    version = getPublishedPackageVersion();
  }

  const blobSvc = createBlobService(azStorageAccount, azStorageAccessKey);
  const container = await new Promise<string>((res, rej) =>
    blobSvc.createContainerIfNotExists(`autorest-ci-coverage-report`, { publicAccessLevel: "blob" }, (error, result) =>
      error ? rej(error) : res(result.name),
    ),
  );

  await new Promise((res, rej) =>
    blobSvc.createBlockBlobFromText(
      container,
      `${repo.split("/")[1]}_${version}.md`,
      `<!-- Ref: ${ref}, Generated at ${new Date().toISOString()} -->\n` + comment,
      { contentSettings: { contentType: "text/markdown; charset=utf-8" } },
      (error, result) => (error ? rej(error) : res(result.name)),
    ),
  );
}

export async function immediatePush(
  repo: string,
  ref: string,
  githubToken: string,
  azStorageAccount: string,
  azStorageAccessKey: string,
  version: string | undefined,
  coverageFolder: string,
): Promise<void> {
  const postComment = githubToken && githubToken !== "skip";
  if (postComment) {
    // try posting "published" comment on GitHub (IMPORTANT: this assumes that this script is only run after successful publish!)
    try {
      // try deriving PR associated with last commit
      const lastCommitMessage = execSync("git log -1 --pretty=%B").toString();
      const pr = +(/\(#(\d+)\)/g.exec(lastCommitMessage) || [])[1];
      if (isNaN(pr)) throw `Could not deduce PR number from commit message ${JSON.stringify(lastCommitMessage)}`;

      if (!version) {
        version = getPublishedPackageVersion();
      }
      const ghClient = new GitHubCiClient(repo, githubToken);
      await ghClient.createComment(
        pr,
        `${GithubCommentHeader}
  # 🤖 AutoRest automatic publish job 🤖
  ## success (version: ${version})
  <!--IMPORTANT: this assumes that this script is only run after successful publish via VSTS! So no "Continue on error" on the publish task!-->`,
      );
    } catch (e) {
      console.log("Posting 'published' comment to GitHub failed.");
      console.log(e);
    }
  }

  const { report, summary } = await collectCoverage(coverageFolder);
  console.log("Uploading coverage report:");
  for (const [category, categorySummary] of Object.entries(summary)) {
    const percent = ((categorySummary.covered / categorySummary.total) * 100).toFixed(3);
    console.log(`  - ${category}: ${percent}% (${categorySummary.covered / categorySummary.total})`);
  }
  console.log("");
  await pushCoverage(repo, ref, azStorageAccount, azStorageAccessKey, report, version);
}
