export interface MockResponse {
  status: number;
  headers?: {
    [key: string]: string | null;
  };
  body?: MockResponseBody;

  /**
   * Let the mock API know that this request was successful to counting coverage regardless of the status code.
   * By default only 2xx status code will count toward success.
   */
  testSuccessful?: boolean;
}

export interface MockResponseBody {
  contentType: string;
  rawContent: string | undefined;
}
