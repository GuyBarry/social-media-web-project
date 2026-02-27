import { StatusCodes } from "http-status-codes";
import { CustomException } from "./customException";

export class NotFoundException extends CustomException {
  constructor(
    resource: string,
    readonly details: string | object,
    cause?: Error["stack"]
  ) {
    super(`${resource} does not exist`, StatusCodes.NOT_FOUND, details, cause);
  }
}
