import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Blog from "../Models/blogModel";
import { UserDocument } from "../Models/userModel";
import { validateBlog } from "../Models/blogModel";

import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
export default class BlogController {
  //CREATE Blog
  static async createblog(req: Request, res: Response) {
    try {
      const { error } = validateBlog(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      // if (!req.user) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }
      const existingBlogs = await Blog.findOne({ title: req.body.title });
      if (existingBlogs) {
        return res.status(409).json({
          message: "This Blog already exists",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a file",
        });
      }
      // return res.send("Please upload a file");
      // console.log("Request: ", req);
      console.log("Request File: ", req.file);
      const result = await cloudinary.uploader.upload(req.file.path);
      const newBlog = new Blog({
        // author: req.user.fullName,
        title: req.body.title,
        description: req.body.description,
        image: result.secure_url,
      });

      const saveBlog = await newBlog.save();

      return res.status(201).json({
        saveBlog,
        message: "your Blog was successfully added",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //UPDATE Blog
  static async updateT(req: Request, res: Response) {
    try {
      const BlogId = req.params.id;
      const blog = await Blog.findById(BlogId);
      if (!blog) {
        return res.status(400).json({
          status: "failed",
          message: "Id of a Blog not found",
        });
      }
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const updatedBlog = await Blog.findByIdAndUpdate(
        { _id: BlogId },
        {
          title: req.body.title,
          description: req.body.description,
          image: result ? result.secure_url : blog.image,
        },
        { new: true }
      );
      return res.status(200).json({
        updatedBlog,
        message: "your Blog was successfully updated",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //DELETE Blog
  static async deleteT(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(400).json({
          status: "failed",
          message: "Id of a Blog not found",
        });
      }
      await Blog.findByIdAndDelete(id);
      return res.status(204).json({
        status: "success",
        message: "Blog deleted ............",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET Blog
  static async findOneBlog(req: Request, res: Response) {
    try {
      const blog = await Blog.findById(req.params.id);
      return res.status(200).json(blog);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET ALL Blogs
  static async findAllBlog(req: Request, res: Response) {
    try {
      const blogs = await Blog.find();

      return res.status(200).json({
        data: blogs,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}
