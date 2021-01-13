export * from "./response-content-utils";
export * from "./mock-api-router";
import { MockApiRouter } from "./mock-api-router";

export const app = new MockApiRouter();
