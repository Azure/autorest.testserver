import * as as from "azure-storage";
import { GitHubCiClient } from "./github";

const commentIndicatorCoverage = "<!--AUTO-GENERATED TESTSERVER COVERAGE COMMENT-->\n";

export async function show(repo, pr, token) {
    const ghClient = new GitHubCiClient(repo, token);

    // try cleaning up previous auto-comments
    try {
        const comments = await ghClient.getCommentsWithIndicator(pr, commentIndicatorCoverage);
        for (const comment of comments) await ghClient.tryDeleteComment(comment.id);
    } catch (e) { }

    // search for reports
    const testServerFolder = __dirname;
    const testServerVersion = require(join(testServerFolder, "package.json")).version;
    const report = {};
    const getWorstCaseReport = (category) => {
        const reports = readdirSync(join(testServerFolder, "coverage")).filter(f => f.startsWith(`report-${category}`) && f.endsWith(".json")).map(f => require(join(testServerFolder, f)));
        const result = {};
        for (const feature of [].concat.apply([], reports.map(r => Object.keys(r)))) {
            result[feature] = Math.min(...reports.map(r => r[feature] || 0));
        }
        return result;
    };

    report.General = getWorstCaseReport("vanilla");
    report.Azure = getWorstCaseReport("azure");
    if (Object.keys(report).every(cat => Object.keys(report[cat]).length === 0)) throw "no report";

    // post report
    let comment = "";
    for (const category of Object.keys(report)) {
        const categoryObject = report[category];
        const features = Object.keys(categoryObject).sort().map(x => [x, categoryObject[x] > 0]);
        const countTotal = features.length;
        const countCovered = features.filter(x => x[1]).length;
        const countMissing = countTotal - countCovered;
        const percentCoverage = countCovered / (countTotal || 1) * 100 | 0;
        comment += `## ${percentCoverage === 100 ? "✔️" : "❌️"} ${category}: ${percentCoverage}%\n\n`;
        if (countMissing > 0) {
            comment += `<details><summary>${countMissing} out of ${countTotal} features are not covered by tests</summary><p>\n\n`;
            let first = true;
            for (const feature of features.filter(x => !x[1])) {
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

    await ghClient.createComment(pr, `${commentIndicatorCoverage}# 🤖 AutoRest automatic feature coverage report 🤖\n*feature set version ${testServerVersion}*\n\n${comment}`);
}

export async function push(repo, pr, token, azStorageAccount, azStorageAccessKey) {
    const blobSvc = createBlobService(azStorageAccount, azStorageAccessKey);
    const ghClient = new GitHubCiClient(repo, token);
    // try pushing coverage
    const coverageComment = (await ghClient.getCommentsWithIndicator(pr, commentIndicatorCoverage))[0];
    if (coverageComment) {
        const container = await new Promise((res, rej) => blobSvc.createContainerIfNotExists(
            `autorest-ci-coverage-report`,
            { publicAccessLevel: "blob" },
            (error, result) => error ? rej(error) : res(result.name)));

        await new Promise((res, rej) =>
            blobSvc.createBlockBlobFromText(
                container,
                `${repo}_${version}.md`,
                `<!-- ${coverageComment.url} -->\n` + coverageComment.message,
                { contentSettings: { contentType: "text/markdown; charset=utf-8" } },
                (error, result) => error ? rej(error) : res(result.name)));
    }
}
