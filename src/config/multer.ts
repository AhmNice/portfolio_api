import { ApiError } from "@/util/errorHandler.js";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";

const uploadDir = path.resolve("src/temp/articles");

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
});

const allowedMimeTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
];

export const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error(`Invalid file type: ${file.mimetype}`));
  },
});
