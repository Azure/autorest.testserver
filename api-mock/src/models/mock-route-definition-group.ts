import { MockRouteDefinition, MockRouteRequestDefinition, MockRouteResponseDefinition } from "./mock-route-definition";

export interface MockRouteDefinitionGroup {
  common: CommonDefinition;
  routes: MockRouteDefinition[];
}

export interface CommonDefinition {
  request: CommonRequestDefinition;
  response: CommonResponseDefinition;
}

export type CommonRequestDefinition = Pick<MockRouteRequestDefinition, "headers">;
export type CommonResponseDefinition = Pick<MockRouteResponseDefinition, "headers">;
