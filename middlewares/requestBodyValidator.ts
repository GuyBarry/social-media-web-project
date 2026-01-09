import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequestBody = (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).send({
        message: "Invalid request body",
        violations: validationResult.error.issues.map((err) => err.message),
      });
    } else {
      next();
    }
  };
