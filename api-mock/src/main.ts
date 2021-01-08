import { ApiMockApp } from "./app";
import { logger } from "./logger";

const run = async () => {
  const app = new ApiMockApp({
    port: 3008,
    include: ["/Users/timotheeguerin/dev/azsdk/autorest.testserver/routes"],
  });
  await app.start();
};

run().catch((e) => {
  logger.error("Error", e);
  process.exit(1);
});
