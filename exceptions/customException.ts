export class CustomException extends Error {
  constructor(
    message: string,
    readonly details: string | object,
    readonly statusCode: number,
    cause?: Error["stack"]
  ) {
    super(message, { cause });

    this.name = "CustomException";
  }
}
