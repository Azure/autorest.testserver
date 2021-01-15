import { ServerResponse } from "http";
import bodyParser from "body-parser";
import express, { ErrorRequestHandler, RequestHandler, Response } from "express";
import morgan from "morgan";
import { logger } from "../logger";
import { cleanupBody } from "../utils";
import { RequestExt } from "./request-ext";

export interface MockApiServerConfig {
  port: number;
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error("Error", err);
  res.status(err.status || 500);
  res
    .contentType("application/json")
    .send(err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : JSON.stringify(err))
    .end();
};

const rawBodySaver = (req: RequestExt, res: ServerResponse, buf: Buffer, encoding: BufferEncoding) => {
  if (buf && buf.length) {
    req.rawBody = cleanupBody(buf.toString(encoding || "utf8"));
  }
};

const loggerstream = {
  write: (message: string) => logger.info(message),
};

export class MockApiServer {
  private app: express.Application;

  constructor(private config: MockApiServerConfig) {
    this.app = express();
    this.app.use(morgan("dev", { stream: loggerstream }));
    this.app.use(bodyParser.json({ verify: rawBodySaver, strict: false }));
    this.app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
    this.app.use(bodyParser.text({ type: "*/pdf", verify: rawBodySaver }));
  }

  public use(route: string, ...handlers: RequestHandler[]): void {
    this.app.use(route, ...handlers);
  }

  public start(): void {
    this.app.use(errorHandler);

    this.app.listen(this.config.port, () => {
      logger.info(`Started server on port ${this.config.port}`);
    });
  }
}

export type ServerRequestHandler = (request: RequestExt, response: Response) => void;
