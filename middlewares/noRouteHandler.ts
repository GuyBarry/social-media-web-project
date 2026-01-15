import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const noRouteHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: "Route does not exist" });
};
