import { Response, Router } from "express";
import { logger } from "../logger";
import { RequestExt } from "../server";
import { MockRequestHandler, processRequest } from "./request-processor";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "head";

export class MockApiRouter {
  public router: Router;

  public constructor() {
    this.router = Router();
  }

  public get(uri: string, name: string, func: MockRequestHandler): void {
    this.request("get", uri, name, func);
  }
  public post(uri: string, name: string, func: MockRequestHandler): void {
    this.request("post", uri, name, func);
  }
  public put(uri: string, name: string, func: MockRequestHandler): void {
    this.request("put", uri, name, func);
  }
  public patch(uri: string, name: string, func: MockRequestHandler): void {
    this.request("patch", uri, name, func);
  }
  public delete(uri: string, name: string, func: MockRequestHandler): void {
    this.request("delete", uri, name, func);
  }
  public head(uri: string, name: string, func: MockRequestHandler): void {
    this.request("head", uri, name, func);
  }

  public request(method: HttpMethod, uri: string, name: string, func: MockRequestHandler): void {
    logger.info(`Registering route ${method} ${uri} (${name})`);
    this.router.route(uri)[method]((req: RequestExt, res: Response) => {
      processRequest(name, req, res, func);
    });
  }
}
