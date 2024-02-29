import Router from "express";
const router = Router();
import { fileUpload } from "../helpers/multer";
import authentication from "../Middlewares/mustHaveAccount";
import admin from "../Middlewares/checkAdmin";

import BlogController from "../Controllers/BlogController";
router.post(
  "/create",
  admin,
  fileUpload.single("image"),
  BlogController.createblog
);
router.get("/", BlogController.findAllBlog);
router.get("/:id", BlogController.findOneBlog);
router.put("/:id", admin, fileUpload.single("image"), BlogController.updateT);
router.delete("/:id", admin, BlogController.deleteT);
router.delete("/many", BlogController.deleteMany);
export default router;
