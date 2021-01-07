import express from "express";
import { MockRouteDefinition } from "../models";

export class MockApiServer {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  public add(route: MockRouteDefinition): void {
    this.app.route(route.request.url)[route.request.method]((_, res) => {
      res.status(route.response.status).contentType(route.response.body.contentType).send(route.response.body.content);
    });
  }

  public addMultiple(routes: MockRouteDefinition[]): void {
    for (const route of routes) {
      this.add(route);
    }
  }
}
