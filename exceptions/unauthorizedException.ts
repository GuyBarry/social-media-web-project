import { StatusCodes } from "http-status-codes";
import { CustomException } from "./customException";

export class UnauthorizedException extends CustomException {
  constructor(readonly details: string | object, cause?: Error["stack"]) {
    super("User is unauthorized", StatusCodes.UNAUTHORIZED, details, cause);
  }
}
