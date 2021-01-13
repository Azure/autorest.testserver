import { Request } from "express";

export class MockRequest {
  public readonly baseUrl: string;
  public readonly headers: { [key: string]: string };

  public constructor(private originalRequest: Request) {
    this.baseUrl = `${originalRequest.protocol}://${originalRequest.get("host")}`;
    this.headers = originalRequest.headers as { [key: string]: string };
  }
}
