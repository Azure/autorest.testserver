import { parseMardownFile } from "./md-parser";

const run = async () => {
  const result = await parseMardownFile(
    "/Users/timotheeguerin/dev/azsdk/autorest.testserver/routes/additionalProperties.md",
  );
  console.log("Result", result);
};


run().catch(e => {
    console.error("Error", e);
    process.exit(1);
})