import path from "path";
import { app } from "../api";
import { registerLegacyRoutes } from "../legacy";
import { logger } from "../logger";
import { internalRouter } from "../routes";
import { MockApiServer } from "../server";
import { coverageService } from "../services";
import { findFilesFromPattern } from "../utils";
import { ApiMockAppConfig } from "./config";

export const ROUTE_FOLDER = path.join(__dirname, "../test-routes");

export class ApiMockApp {
  private server: MockApiServer;

  constructor(private config: ApiMockAppConfig) {
    this.server = new MockApiServer({ port: config.port });
  }

  public async start(): Promise<void> {
    this.server.use("/", internalRouter);

    await requireMockRoutes(ROUTE_FOLDER);
    registerLegacyRoutes(this.server);
    coverageService.init(this.config.coverageDirectory, this.config.appendCoverage);
    const apiRouter = app;
    this.server.use("/", apiRouter.router);
    this.server.start();
  }
}

export const requireMockRoutes = async (routesFolder: string): Promise<void> => {
  const files = await findFilesFromPattern(path.join(routesFolder, "/**/*.js"));
  logger.debug("Detected routes:", files);
  for (const file of files) {
    require(path.resolve(file));
  }
};
