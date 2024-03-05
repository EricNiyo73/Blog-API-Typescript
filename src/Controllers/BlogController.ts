import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Blog from "../Models/blogModel";
import { validateBlog } from "../Models/blogModel";

import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default class BlogController {
  //CREATE Blog
  static async createblog(req: Request, res: Response) {
    const { error } = validateBlog(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const existingBlog = await Blog.findOne({ title: req.body.title });
    if (existingBlog) {
      return res.status(409).json({
        message: "This Blog already exists",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const newBlog = new Blog({
      title: req.body.title,
      description: req.body.description,
      image: result.secure_url,
    });
    const savedBlog = await newBlog.save();
    return res.status(201).json({
      savedBlog,
      message: "Your Blog was successfully added",
    });
  }

  //UPDATE Blog
  static async updateT(req: Request, res: Response) {
    const BlogId = req.params.id;
    const blog = await Blog.findById(BlogId);
    if (!blog) {
      return res.status(404).json({
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
      data: updatedBlog,
      message: "your Blog was successfully updated",
    });
  }

  //DELETE Blog
  static async deleteT(req: Request, res: Response) {
    const id = req.params.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(400).json({
        message: "Id of a Blog not found",
      });
    }
    await Blog.findByIdAndDelete(id);
    return res.status(204).json({
      status: "success",
      message: "Blog deleted ............",
    });
  }
  //deleteMany

  //GET Blog
  static async findOneBlog(req: Request, res: Response) {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      return res.status(200).json(blog);
    } else {
      return res.status(400).json({ message: "Id of a Blog not found" });
    }
  }

  //GET ALL Blogs
  static async findAllBlog(req: Request, res: Response) {
    const blogs = await Blog.find();
    return res.status(200).json({
      data: blogs,
    });
  }
}
