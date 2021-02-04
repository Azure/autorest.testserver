export interface MockResponse {
  status: number;
  headers?: {
    [key: string]: string | null;
  };
  body?: MockResponseBody;
}

export interface MockResponseBody {
  contentType: string;
  rawContent: string | undefined;
}
