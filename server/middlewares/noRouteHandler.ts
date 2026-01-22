import { NextFunction, Request, Response } from "express";
import { NotFoundException } from "../exceptions/notFoundException";

export const noRouteHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  throw new NotFoundException("Route", "The requested route does not exist");
};
