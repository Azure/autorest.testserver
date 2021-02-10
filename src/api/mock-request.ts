import { RequestExt } from "../server";
import { getRequestBaseUrl } from "../utils";
import { RequestExpectation } from "./request-expectation";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body.";

export class MockRequest {
  public readonly expect: RequestExpectation;

  public readonly baseUrl: string;
  public readonly headers: { [key: string]: string };
  public readonly query: { [key: string]: string };
  public readonly params: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly body: any;

  public constructor(public originalRequest: RequestExt) {
    this.baseUrl = getRequestBaseUrl(originalRequest);
    this.expect = new RequestExpectation(originalRequest);
    this.headers = originalRequest.headers as { [key: string]: string };
    this.query = originalRequest.query as { [key: string]: string };
    this.params = originalRequest.params as { [key: string]: string };
    this.body = originalRequest.body;
  }
}
