import { MockApiServer } from "../server";
import { ApiMockAppConfig } from "./config";

export class ApiMockApp {
  private server: MockApiServer;

  constructor(private config: ApiMockAppConfig) {
    this.server = new MockApiServer({ port: config.port });
  }

  public async start(): Promise<void> {
    this.server.start();
  }
}
