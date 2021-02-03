import deepEqual from "deep-equal";
import { parseString } from "xml2js";
import { RequestExt } from "../server";
import { ValidationError } from "./validation-error";

export const BODY_NOT_EQUAL_ERROR_MESSAGE = "Body provided doesn't match expected body";

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

/**
 * Check if the provided body is empty.
 * @param body express.js request body.
 */
const isBodyEmpty = (body: string | undefined | null) => {
  return body == null || body === "";
};

const coerceDateXml = (xml: string): string => {
  return xml.replace(/(\d\d\d\d-\d\d-\d\d[Tt]\d\d:\d\d:\d\d\.\d\d\d)\d{0,4}([Zz]|[+-]00:00)/g, "$1Z");
};

// Check whether the XML request body is valid

export const validateXMLBodyEquals = (request: RequestExt, expectedBody: string): void => {
  const rawBody = request.body;
  const actualBody = coerceDateXml(rawBody);
  parseString(actualBody, (err, actualParsedBody) => {
    parseString(expectedBody, (err, expectedParsedBody) => {
      if (!deepEqual(actualParsedBody, expectedParsedBody, { strict: true })) {
        throw new ValidationError(BODY_NOT_EQUAL_ERROR_MESSAGE, expectedParsedBody, actualParsedBody);
      }
    });
  });
};
