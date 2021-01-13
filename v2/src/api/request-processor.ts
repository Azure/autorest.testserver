import { Response } from "express";
import { RequestExt } from "../server";
import { MockRequest } from "./mock-request";
import { MockResponse } from "./mock-response";

export type MockRequestHandler = (req: MockRequest) => MockResponse | Promise<MockResponse>;

export const processRequest = async (
  name: string,
  req: RequestExt,
  res: Response,
  func: MockRequestHandler,
): Promise<void> => {
  const mockRequest = new MockRequest(req);
  const mockResponse = await func(mockRequest);

  res.status(mockResponse.status);

  if (mockResponse.headers) {
    res.set(mockResponse.headers);
  }

  if (mockResponse.body) {
    res.contentType(mockResponse.body.contentType).send(mockResponse.body.rawContent);
  }

  res.end();
};
