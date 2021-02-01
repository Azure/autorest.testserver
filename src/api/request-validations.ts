import deepEqual from "deep-equal";
import { RequestExt } from "../server";
import { ValidationError } from "./validation-error";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body";
export const BODY_EMPTY_ERROR_MESSAGE = "Body should exists";
export const BODY_NOT_EMPTY_ERROR_MESSAGE = "Body should be empty";

export const validateRawBodyEquals = (request: RequestExt, expectedRawBody: string | undefined): void => {
  const actualRawBody = request.rawBody;

  if (expectedRawBody == null) {
    if (!isBodyEmpty(actualRawBody)) {
      throw new ValidationError(BODY_NOT_EQUAL_ERROR_MESSAGE, expectedRawBody, actualRawBody);
    }
    return;
  }

  if (actualRawBody !== expectedRawBody) {
    throw new ValidationError(BODY_NOT_EQUAL_ERROR_MESSAGE, expectedRawBody, actualRawBody);
  }
};

export const validateBodyEquals = (request: RequestExt, expectedBody: unknown | undefined): void => {
  if (expectedBody == null) {
    if (!isBodyEmpty(request.rawBody)) {
      throw new ValidationError(BODY_NOT_EQUAL_ERROR_MESSAGE, expectedBody, request.rawBody);
    }
    return;
  }

  if (!deepEqual(request.body, expectedBody, { strict: true })) {
    throw new ValidationError(BODY_NOT_EQUAL_ERROR_MESSAGE, expectedBody, request.body);
  }
};

export const validateBodyEmpty = (request: RequestExt): void => {
  if (isBodyEmpty(request.rawBody)) {
    if (request.body instanceof Buffer) {
      if (request.body.length > 0) {
        throw new ValidationError(BODY_NOT_EMPTY_ERROR_MESSAGE, undefined, request.rawBody);
      }
    }
  } else {
    throw new ValidationError(BODY_EMPTY_ERROR_MESSAGE, undefined, request.rawBody);
  }
};

export const validateBodyNotEmpty = (request: RequestExt): void => {
  if (isBodyEmpty(request.rawBody)) {
    if (request.body instanceof Buffer) {
      if (request.body.length === 0) {
        throw new ValidationError(BODY_EMPTY_ERROR_MESSAGE, undefined, request.rawBody);
      }
    } else {
      throw new ValidationError(BODY_EMPTY_ERROR_MESSAGE, undefined, request.rawBody);
    }
  }
};

/**
 * Check if the provided body is empty.
 * @param body express.js request body.
 */
const isBodyEmpty = (body: string | undefined | null) => {
  return body == null || body === "";
};
