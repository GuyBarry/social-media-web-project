import { NextFunction, Request, Response } from "express";
import { getFileUrl } from "../pictures/pictures.service";

export const injectUploadedFileUrl = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.file) {
    req.body.picture = getFileUrl(req.file.filename);
  }
  next();
};