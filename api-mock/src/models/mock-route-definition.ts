export type HttpMethod = "get" | "post" | "put" | "head" | "delete";

export interface MockRouteDefinition {
  request: MockRouteRequestDefinition;
  response: MockRouteResponseDefinition;
}

export interface MockRouteRequestDefinition {
  url: string;
  headers: { [key: string]: string };
  method: HttpMethod;
}

export interface MockRouteResponseDefinition {
  status: number;
  headers: { [key: string]: string };
  body: MockBody;
}

export interface MockBody {
  contentType: string;
  content: string;
}
