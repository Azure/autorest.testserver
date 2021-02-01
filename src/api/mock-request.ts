import { RequestExt } from "../server";
import { getRequestBaseUrl } from "../utils";
import {
  validateBodyEmpty,
  validateBodyEquals,
  validateBodyNotEmpty,
  validateRawBodyEquals,
} from "./request-validations";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body.";

export class MockRequest {
  public readonly baseUrl: string;
  public readonly headers: { [key: string]: string };
  public readonly query: { [key: string]: string };
  public readonly params: { [key: string]: string };

  public constructor(private originalRequest: RequestExt) {
    this.baseUrl = getRequestBaseUrl(originalRequest);
    this.headers = originalRequest.headers as { [key: string]: string };
    this.query = originalRequest.query as { [key: string]: string };
    this.params = originalRequest.params as { [key: string]: string };
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
}
