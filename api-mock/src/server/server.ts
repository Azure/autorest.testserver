import express from "express";

export class MockApiServer {
  private app: express.Application;

  constructor() {
    this.app = express();
  }
}
