import { NextFunction, Request, Response } from "express";
import { getFileUrl } from "../pictures/pictures.service";

export const injectUploadedUrl =
  (field: string) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (req.file) {
      req.body[field] = getFileUrl(req.file.filename);
    }
    next();
  };
