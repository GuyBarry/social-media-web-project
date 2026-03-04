import multer from "multer";
import path from "path";
import { Request } from "express";

type MulterFile = Express.Multer.File;

export const UPLOAD_DIR = path.resolve(__dirname, "../public");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const storage = multer.diskStorage({
  destination: function (
    _request: Request,
    _file: MulterFile,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, UPLOAD_DIR);
  },
  filename: function (
    _request: Request,
    file: MulterFile,
    callback: (error: Error | null, filename: string) => void,
  ) {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

export const fileFilter = (
  _request: Request,
  file: MulterFile,
  callback: multer.FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error(`Unsupported file type: ${file.mimetype}`));
  }
};
