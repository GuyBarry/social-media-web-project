import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomException } from "../exceptions/customException";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof CustomException) {
    const { message, details, statusCode, stack } = error;

    res.status(statusCode).send({
      message,
      details,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Oops, something went wrong!",
    });
  }
};
