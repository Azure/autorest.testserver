import path from "path";
import { app } from "../api";
import { logger } from "../logger";
import { MockApiServer } from "../server";
import { findFilesFromPattern } from "../utils";
import { ApiMockAppConfig } from "./config";

const ROUTE_FOLDER = path.join(__dirname, "../routes");
export class ApiMockApp {
  private server: MockApiServer;

  constructor(private config: ApiMockAppConfig) {
    this.server = new MockApiServer({ port: config.port });
  }

  public async start(): Promise<void> {
    await requireRoutes(ROUTE_FOLDER);
    const apiRouter = app;
    this.server.use("/", apiRouter.router);
    this.server.start();
  }
}

const requireRoutes = async (routesFolder: string) => {
  const files = await findFilesFromPattern(path.join(routesFolder, "/**/*.js"));
  logger.debug("Detected routes:", files);
  for (const file of files) {
    require(path.resolve(file));
  }
};
