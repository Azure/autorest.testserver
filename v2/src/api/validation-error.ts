export class ValidationError extends Error {
  constructor(message: string, public expected: unknown | undefined, public actual: unknown | undefined) {
    super(message);
  }

  public toJSON(): string {
    return JSON.stringify({ message: this.message, expected: this.expected, actual: this.actual });
  }
}
