import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodObject } from "zod";

export const validateRequestBody =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Invalid request body",
        violations: validationResult.error.issues.map((err) => err.message),
      });
    } else {
      next();
    }
  };
