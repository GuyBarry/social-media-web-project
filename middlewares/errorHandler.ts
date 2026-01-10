import { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error({
    message: error?.message,
    stack: error?.stack,
  });

  res.status(500).send({
    message: "Oops, something went wrong!",
  });
};
