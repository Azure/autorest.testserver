import { RequestExt } from "../server";
import { validateBodyEquals, validateRawBodyEquals } from "./request-validations";
import { ValidationError } from "./validation-error";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body.";

export class MockRequest {
  public readonly baseUrl: string;
  public readonly headers: { [key: string]: string };

  public constructor(private originalRequest: RequestExt) {
    this.baseUrl = `${originalRequest.protocol}://${originalRequest.get("host")}`;
    this.headers = originalRequest.headers as { [key: string]: string };
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
}
