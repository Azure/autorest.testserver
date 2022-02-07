import { Response, Router } from "express";
import PromiseRouter from "express-promise-router";
import { logger } from "../logger";
import { RequestExt } from "../server";
import { coverageService } from "../services";
import { MockRequestHandler, processRequest } from "./request-processor";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "head";

export type Category = "vanilla" | "azure" | "dpg" | "optional";

export class MockApiRouter {
  public router: Router;
  private currentCategory: Category | undefined;

  public constructor() {
    this.router = PromiseRouter();
  }

  /**
   * Set the category for the route definition inside of the provided function.
   * @param category Category.
   * @param callback Callback where are defined the mock routes.
   */
  public category(category: Category, callback: () => void): void {
    this.currentCategory = category;
    callback();
    this.currentCategory = undefined;
  }

  /**
   * Register a GET request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public get(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("get", uri, name, func);
  }

  /**
   * Register a POST request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public post(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("post", uri, name, func);
  }

  /**
   * Register a PUT request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public put(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("put", uri, name, func);
  }

  /**
   * Register a PATCH request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public patch(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("patch", uri, name, func);
  }

  /**
   * Register a DELETE request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public delete(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("delete", uri, name, func);
  }

  /**
   * Register a HEAD request for the provided uri.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   */
  public head(uri: string, name: string | undefined, func: MockRequestHandler): void {
    this.request("head", uri, name, func);
  }

  /**
   * Register a request for the provided uri.
   * @param method Method to use.
   * @param uri URI to match.
   * @param name Name of the scenario(For coverage).
   * @param func Request handler.
   *
   * @note prefer to use the coresponding method method directly instead of `#request()`(i.e `#get(), #post()`)
   */
  public request(method: HttpMethod, uri: string, name: string | undefined, func: MockRequestHandler): void {
    logger.info(`Registering route ${method} ${uri} (${name})`);
    if (this.currentCategory === undefined) {
      throw new Error(
        [
          `Cannot register route ${method} ${uri} (${name}), missing category.`,
          `Please wrap it in:`,
          `app.category("vanilla" | "azure", () => {`,
          `  // app.get(...`,
          `});`,
          "",
        ].join("\n"),
      );
    }
    const category = this.currentCategory;
    if (name) {
      coverageService.register(category, name);
    }
    this.router.route(uri)[method](async (req: RequestExt, res: Response) => {
      await processRequest(category, name, req, res, func);
    });
  }
}
