import fs from "fs/promises";
import multer from "multer";
import path from "path";
import { fileFilter, storage, UPLOAD_DIR } from "./pictures.config";
import { serverConfig } from "../config/server.config";

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const getFileUrl = (filename: string): string => {
  return `${serverConfig.serverUrl}/public/${filename}`;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const filename = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.unlink(filePath);
};
