import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomException } from "../exceptions/customException";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomException) {
    const { message, details, statusCode, stack } = error;

    // console.error({
    //   message: message,
    //   details: details,
    //   stack: stack,
    // });

    res.status(statusCode).send({
      message,
      details,
    });
  } else {
    // console.error({
    //   message: error?.message,
    //   stack: error?.stack,
    // });

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Oops, something went wrong!",
    });
  }
};
