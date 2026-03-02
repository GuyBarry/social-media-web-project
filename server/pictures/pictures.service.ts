import multer from "multer";
import { fileFilter, storage } from "./pictures.config";
import { serverConfig } from "../config/server.config";

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const getFileUrl = (filename: string): string => {
  return `${serverConfig.serverUrl}/public/${filename}`;
};