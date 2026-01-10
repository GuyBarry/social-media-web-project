export class CustomException extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly details?: string | object,
    cause?: Error["stack"]
  ) {
    super(message, { cause });

    this.name = "CustomException";
  }
}
