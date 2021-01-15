import { MockResponseBody } from "./mock-response";

/**
 * Serialize the provided content as json to use in a MockResponse body.
 * @content Object to return as json.
 * @returns {MockResponseBody} response body with application/json content type.
 */
export const json = (content: unknown): MockResponseBody => {
  return {
    contentType: "application/json",
    rawContent: JSON.stringify(content),
  };
};
