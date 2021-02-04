import { RequestExt } from "../server";
import { getRequestBaseUrl } from "../utils";
import {
  validateBodyEquals,
  validateRawBodyEquals,
  validateXMLBodyEquals,
  validateBodyEmpty,
  validateBodyNotEmpty,
} from "./request-validations";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body.";

export class MockRequest {
  public readonly baseUrl: string;
  public readonly headers: { [key: string]: string };
  public readonly query: { [key: string]: string };
  public readonly params: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly body: any;

  public constructor(public originalRequest: RequestExt) {
    this.baseUrl = getRequestBaseUrl(originalRequest);
    this.headers = originalRequest.headers as { [key: string]: string };
    this.query = originalRequest.query as { [key: string]: string };
    this.params = originalRequest.params as { [key: string]: string };
    this.body = originalRequest.body;
  }

  /**
   * Expect the raw body of the request to match the given string.
   * @param rawBody Raw request body.
   * @throws {ValidationError} if there is an error.
   */
  public rawBodyEquals(expectedRawBody: string | undefined): void {
    validateRawBodyEquals(this.originalRequest, expectedRawBody);
  }

  /**
   * Expect the body of the request to match the given object.
   * @param rawBody Raw request body.
   * @throws {ValidationError} if there is an error.
   */
  public bodyEquals(expectedRawBody: unknown | undefined): void {
    validateBodyEquals(this.originalRequest, expectedRawBody);
  }

  /**
   * Expect the body of the request to be empty.
   * @throws {ValidationError} if there is an error.
   */
  public bodyEmpty(): void {
    validateBodyEmpty(this.originalRequest);
  }

  /**
   * Expect the body of the request to be not empty.
   * @throws {ValidationError} if there is an error.
   */
  public bodyNotEmpty(): void {
    validateBodyNotEmpty(this.originalRequest);
  }

  /**
   * Expect the body of the request matches the XML body you expect
   * @param expectedRawBody Raw request XML body expressed in a string.
   * @throws {ValidationError} if there is an error.
   */
  public async xmlBodyEquals(expectedRawBody: string): Promise<void> {
    await validateXMLBodyEquals(this.originalRequest, expectedRawBody);
  }
}
