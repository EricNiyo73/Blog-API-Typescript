import multer from "multer";
import path from "path";
import { Request } from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
      ext !== ".bmp" &&
      ext !== ".tiff"
    ) {
      cb(new Error("Invalid file type") as any, false);
    } else {
      cb(null, true);
    }
  },
});
