import { Request, Response, NextFunction } from "express";

export const noRouteHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).send({ message: "Route does not exist" });
};
