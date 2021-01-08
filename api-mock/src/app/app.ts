import { parseMardownFile } from "../md-parser";
import { MockApiServer } from "../server";
import { findFiles } from "../utils";

export interface ApiMockAppConfig {
  /**
   * Pattern/folder to include.
   */
  include: string[];

  port: number;
}

export class ApiMockApp {
  private server: MockApiServer;

  constructor(private config: ApiMockAppConfig) {
    this.server = new MockApiServer({ port: config.port });
  }

  public async start(): Promise<void> {
    const files = await findFiles(this.config.include);
    for (const file of files) {
      const group = await parseMardownFile(file);
      this.server.addMultiple(group.routes);
    }
    this.server.start();
  }
}
