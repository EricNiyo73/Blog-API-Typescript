import multer from "multer";
import path from "path";
import { Request } from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const fileUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".gif" &&
      ext !== ".tif" &&
      ext !== ".webp" &&
      ext !== ".bmp"
    ) {
      cb(new Error("Invalid file type") as any, false);
    } else {
      cb(null, true);
    }
  },
});
