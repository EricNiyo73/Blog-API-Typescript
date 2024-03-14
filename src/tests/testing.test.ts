import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import supertest from "supertest";
import app from "./index.test";
import Message from "../Models/messageModel";
import User from "../Models/userModel";
import Blog from "../Models/blogModel";

import authMiddleware from "../Middlewares/mustHaveAccount";
import checkAdmin from "../Middlewares/checkAdmin";
import { userInfo } from "os";
import fs from "fs";
import path from "path";
const request = supertest(app);
import { createServer, Server } from "http";
import mongoose from "mongoose";

let server: Server;

beforeAll((done) => {
  server = createServer(app);
  server.listen(7000, done);
});

afterAll((done) => {
  server.close(done);
});
describe("Auth Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockToken: string;
  let user: any;
  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Partial<Response>;
    next = jest.fn();
    mockToken = jwt.sign({ id: "mockusers._id" }, process.env.JWT_SECRET || "");
  });

  it("should return 401 if no token provided", async () => {
    await authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized, please Login",
    });
  });

  it("should return 401 if token is invalid", async () => {
    req.headers = { authorization: "invalidToken" };
    await authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("let us see if it should return 401 if token is expired", async () => {
    const expiredToken = jwt.sign(
      { id: "mockusers._id" },
      process.env.JWT_SECRET || "",
      { expiresIn: 0 }
    );
    req.headers = { authorization: `${expiredToken}` };
    await authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token expired" });
  });

  it("should return 401 if user not found after decoding a token", async () => {
    const tokens =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjJhMWIyN2ExMjk2MGE1ZjdkYjg5NCIsImlhdCI6MTcxMDM5OTkyMiwiZXhwIjoxNzEwODMxOTIyfQ.uLXhFfXAnLPSR8MfcvfVn42kO5z6r8zTxTMYm1cr9dw";
    req.headers = { authorization: tokens };
    await authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please create an account",
    });
  });
  it("should set req.user if token is valid", async () => {
    const users = new User({
      email: "valid4@test.com",
      fullName: "test",
      password: "password",
    });
    const user: any = users.save();

    const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
      expiresIn: "5d",
    });
    req.headers = { authorization: `${token}` };
    await authMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    await User.findByIdAndDelete(users._id);
  });

  it("should handle other errors", async () => {
    const error = new Error("Some other error");
    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw error;
    });
    req.headers = { authorization: `${mockToken}` };
    await authMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized, please Login",
    });
  });
});
describe("Admin Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockToken: string;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Partial<Response>;
    next = jest.fn();
    mockToken = jwt.sign({ id: "mockusers._id" }, process.env.JWT_SECRET || "");
  });

  it("should return 401 if no token provided", async () => {
    await checkAdmin(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized, please Login",
    });
  });

  it("should return 401 if token is invalid", async () => {
    req.headers = { authorization: "invalidToken" };
    await checkAdmin(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("let us see if it should return 401 if token is expired", async () => {
    const expiredToken = jwt.sign(
      { id: "mockusers._id" },
      process.env.JWT_SECRET || "",
      { expiresIn: 0 }
    );
    req.headers = { authorization: `${expiredToken}` };
    await checkAdmin(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token expired" });
  });

  // it("should set req.user if token is valid and user is admin", async () => {
  //   const users = new User({
  //     email: "il@test.com",
  //     fullName: "test",
  //     password: "password",
  //     userRole: "admin",
  //   });
  //   users.save();

  //   const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
  //     expiresIn: "5d",
  //   });
  //   req.headers = { authorization: token };
  //   await checkAdmin(req as Request, res as Response, next);
  //   expect(next).toHaveBeenCalled();
  //   await User.findByIdAndDelete(users._id);
  // });

  it("should return 401 if token is valid but user is not admin", async () => {
    const users = new User({
      email: "testyu@test.com",
      fullName: "test",
      password: "password",
      userRole: "user",
    });
    users.save();
    const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
      expiresIn: "40h",
    });
    req.headers = { authorization: token };
    await checkAdmin(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "You are not allowed to perform this action",
    });
    expect(next).not.toHaveBeenCalled();
    await User.findByIdAndDelete(users._id);
  });

  it("should handle other errors", async () => {
    const error = new Error("Some other error");
    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw error;
    });
    req.headers = {
      authorization: `${mockToken}`,
    };
    await checkAdmin(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized, please Login",
    });
  });
});
describe("POST /api/users/signup", () => {
  const users = new User({
    email: "testing@test.com",
    fullName: "test",
    password: "password",
    userRole: "admin",
  });
  users.save();
  let adminT = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
    expiresIn: "20h",
  });
  it("should return 400 if email is missing", async () => {
    const res = await request
      .post("/api/users/signup")
      .send({ fullName: "test", password: "password" });

    expect(res.status).toBe(400);
    expect(res.text).toContain('"email" is required');
  });
  it("should return 400 if password is missing", async () => {
    const res = await request
      .post("/api/users/signup")
      .send({ fullName: "test", email: "test@example.com" });

    expect(res.status).toBe(400);
    expect(res.text).toContain('"password" is required');
  });

  it("should return 400 if password is too short", async () => {
    const res = await request
      .post("/api/users/signup")
      .send({ fullName: "test", email: "test@example.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.text).toContain(
      '"password" length must be at least 8 characters long'
    );
  });

  it("should return 400 for invalid data", async () => {
    const res = await request.post("/api/users/signup").send({
      fullName: "test",
      email: "invalid-email",
      password: "123456789",
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain('"email" must be a valid email');
  });

  it("should POST a new user", async () => {
    const res = await request.post("/api/users/signup").send({
      fullName: "test",
      email: "tokyogkk@test.com",
      password: "password",
    });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("message");
  });
  it("should return 409 Email  already exists", async () => {
    const res = await request.post("/api/users/signup").send({
      fullName: "test",
      email: "testrt@test.com",
      password: "password",
    });

    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty("message");
  });
  it("should get a user", async () => {
    const res = await request.get(`/api/users/${users._id}`).send({
      fullName: "test",
      email: "test7@test.com",
      password: "password",
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });
  it("should get a user", async () => {
    const res = await request
      .get(`/api/users`)
      .set("Authorization", `${adminT}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    // expect(res.body).toHaveProperty("message");
  });
  // =============================update user=====================================

  it("should return 400 for validating update inputs", async () => {
    const res = await request.put(`/api/users/${users._id}`).send({
      email: "invalid",
      password: "123456789",
    });
    expect(res.status).toEqual(400);
    expect(res.text).toContain('"email" must be a valid email');
  });

  it("should PUT a user and return succesful message", async () => {
    const res = await request.put(`/api/users/${users._id}`).send({
      fullName: "test",
      email: "test7@test.com",
      password: "password",
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });
  it("should delete a user by the given id", async () => {
    const res = await request.delete(`/api/users/${users._id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
  it("should return 404 if user  to be updated not found", async () => {
    const res = await request.put(`/api/users/${users._id}`).send({
      fullName: "test",
      email: "test7@test.com",
      password: "password",
    });
    expect(res.status).toEqual(404);
    expect(res.body).toEqual({
      message: "Id of a User not found",
    });
  });

  it("should return 404 if user not found", async () => {
    const res = await request.delete(`/api/users/${users._id}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      status: "failed",
      message: "Id of a User not found",
    });
  });
  it("should return 500 if user not found", async () => {
    const res = await request.get(`/api/users/${users._id}`);
    expect(res.status).toEqual(404);
  });
});

describe("POST /api/users/login", () => {
  let token: string;

  it("should log in a user", async () => {
    const res = await request.post("/api/users/login").send({
      email: "testropk@test.com",
      password: "password",
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("message");
    token = res.body.user;
    expect(res.body).toHaveProperty("token");
  });

  it("should return 400 for invalid password and email", async () => {
    const res = await request.post("/api/users/login").send({
      email: "invalid",
      password: "invalid",
    });

    expect(res.status).toEqual(400);
    // expect(res.body).toHaveProperty("message");
  });
  it("should return 404 when an email not found", async () => {
    const res = await request.post("/api/users/login").send({
      email: "invalid@test.com",
      password: "password",
    });

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty("message");
  });
  it("should return 404 when a password does not match", async () => {
    const res = await request.post("/api/users/login").send({
      email: "subscriber@test.com",
      password: "passwordd",
    });

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });
});

// =======================================blogs===================================

describe("Blogs api testing", () => {
  const filePath = path.join(__dirname, "testImage.png");
  const blog = new Blog({
    title: "Testzg blog",
    description: "test desc blog",
    image: "testImage.png",
  });
  blog.save();

  const users = new User({
    email: "bloger@test.com",
    fullName: "test",
    password: "password",
    userRole: "admin",
  });
  users.save();

  let adminT = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
    expiresIn: "20h",
  });
  // let token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTVjYWUxZDRlNTNmZWVmZTUyM2ZlYSIsImlhdCI6MTcwOTU1ODQ5NywiZXhwIjoxNzA5OTkwNDk3fQ.BD_w7V19jz1vzT2GzTe45F1XAj1RY3ARwnaoixyBgCE";

  it("should  add a blog and return success ", async () => {
    const newBlog = {
      title: "testTokyohkk blog",
      description: "test desc blog",
      image: "testImage.png",
    };

    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${adminT}`)
      .attach("image", filePath)
      .field("title", newBlog.title)
      .field("description", newBlog.description);

    expect(res.status).toEqual(201);
  });
  it("should fail to upload a file with invalid file type ", async () => {
    const newBlog = {
      title: "Testzk blog",
      description: "test desc blog",
      image: "testImage.tiff",
    };
    const filePathInvalid = path.join(__dirname, "testImage.tiff");
    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${adminT}`)
      .attach("image", filePathInvalid)
      .field("title", newBlog.title)
      .field("description", newBlog.description);

    expect(res.status).toEqual(500);
    // expect(res.body).toHaveProperty("error", "Invalid file type");
  });
  it("should  return 409 if blog title already exist ", async () => {
    const newBlog = {
      title: "Testzk blog",
      description: "test2 desc blog",
      image: "testImage.png",
    };

    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${adminT}`)
      .attach("image", filePath)
      .field("title", newBlog.title)
      .field("description", newBlog.description);

    expect(res.status).toEqual(409);
  });

  it("should return 400 if title or other fiels is missing ", async () => {
    const newBlog = {
      description: "test desc blog",
      title: "test0 title ",
      image: "testImage.png",
    };
    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${adminT}`)
      .attach("image", filePath)
      .field("description", newBlog.description);

    expect(res.status).toEqual(400);
    expect(res.text).toContain('"title" is required');
  });
  it("should return 400 if req.file is missing ", async () => {
    const newBlog = {
      description: "test desc blog",
      title: "test0 title ",
      image: "testImage.png",
    };
    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${adminT}`)
      .field("description", newBlog.description)
      .field("title", newBlog.title);

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });
  it("should  retrieve all  blogs and return success ", async () => {
    const res = await request.get("/api/blogs");
    expect(res.status).toEqual(200);
  });
  it("should retrieve a single blog and return success ", async () => {
    const res = await request.get(`/api/blogs/${blog._id}`);
    expect(res.status).toEqual(200);
  });
  // ================================updates================================================
  it("UPDATE existing Blog, require admin Authorization ", async () => {
    const updateBlog = {
      title: "updated blog",
      description: "updted desc blog",
      image: "testImage.png",
    };

    const res = await request
      .put(`/api/blogs/${blog._id}`)
      .set("Authorization", `${adminT}`)
      .attach("image", filePath)
      .field("title", updateBlog.title)
      .field("description", updateBlog.description);

    expect(res.status).toEqual(200);
  });
  it("should  delete a blog and return success ", async () => {
    const res = await request
      .delete(`/api/blogs/${blog._id}`)
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(204);
  });
  it("UPDATE ,updating a Blog with invalid id, ", async () => {
    const updateBlog = {
      title: "updated blog",
      description: "updted desc blog",
      image: "testImage.png",
    };

    const res = await request
      .put(`/api/blogs/${blog._id}`)
      .set("Authorization", `${adminT}`)
      .attach("image", filePath)
      .field("title", updateBlog.title)
      .field("description", updateBlog.description);

    expect(res.status).toEqual(404);
  });
  it("should return 404 if id to be returned not found", async () => {
    const res = await request.get(`/api/blogs/${blog._id}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a Blog not found",
    });
  });
  it("should return 404 if id tobe deleted not found", async () => {
    const res = await request
      .delete(`/api/blogs/${blog._id}`)
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a Blog not found",
    });
    await User.findByIdAndDelete(users._id);
  });
});

// ====================================messages================================
describe(" messages api testing", () => {
  const message = new Message({
    fullName: "Test yyhhykkmessage",
    email: "test1@example.com",
    messageContent: "Test message content",
  });
  message.save();
  const users = new User({
    email: "messager@test.com",
    fullName: "test",
    password: "password",
    userRole: "admin",
  });
  users.save();

  let adminT = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
    expiresIn: "20h",
  });
  let mtoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTAyMTk0ZWE0NDU3NDI4N2UxNTQxZSIsImlhdCI6MTcwOTc5OTM0NSwiZXhwIjoxNzA5ODg1NzQ1fQ.sdRWAR8A_R1keFCGPjM9drPgtVW06AuYaSqoqEd88iE";
  it("should  add a message and return success ", async () => {
    const newMessage = {
      fullName: "Test yyhhykkmessage",
      email: "test1@example.com",
      messageContent: "Test message content",
    };

    const res = await request.post("/api/messages/create").send(newMessage);

    expect(res.status).toEqual(201);
  });

  it("should return 400 if email or other fiels is missing ", async () => {
    const res = await request.post("/api/messages/create").send({
      fullName: "Test yyhhykkmessage",
      messageContent: "Test message content",
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain('"email" is required');
  });
  it("should  retrieve all  messages and return success ", async () => {
    const res = await request
      .get("/api/messages")
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(200);
  });
  it("should retrieve a single message and return success ", async () => {
    const res = await request
      .get(`/api/messages/${message._id}`)
      .set("Authorization", `${adminT}`);
    expect(res.status).toEqual(200);
  });
  it("should  delete a message and return success ", async () => {
    const res = await request
      .delete(`/api/messages/${message._id}`)
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(204);
  });
  it("should return 404 if id to be returned not found", async () => {
    const res = await request
      .get(`/api/messages/${message._id}`)
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "message not found",
    });
  });
  it("should return 404 if id tobe deleted not found", async () => {
    const res = await request
      .delete(`/api/messages/${message._id}`)
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a message not found",
    });
    await User.findByIdAndDelete(users._id);
  });
});
describe("Comment and like api testing", () => {
  const blogId = "65e6cf52596ac588a59627cc";
  const fakeBlogId = "65e6b8604348275e68256c36";
  const ftoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTVjYWUxZDRlNTNmZWVmZTUyM2ZlYSIsImlhdCI6MTcwOTU1ODQ5NywiZXhwIjoxNzA5OTkwNDk3fQ.BD_w7V19jz1vzT2GzTe45F1XAj1RY3ARwnaoixyBgCB";
  const users = new User({
    email: "testcommentor1@test.com",
    fullName: "test",
    password: "password",
    userRole: "admin",
  });
  users.save();

  const adminToken = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
    expiresIn: "5d",
  });
  // let adminToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTcyOGE5YjQ1OTQ3NWQzMDNkZjIyZCIsImlhdCI6MTcwOTY0ODA0MiwiZXhwIjoxNzEwMDgwMDQyfQ.GrrRpzCuEnqnh_bggGpvy9-e_ivYOnwU0LAA4g-DtdQ";

  it("should  add a comment to the specified blog and return success ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/add-comment/${blogId}`)
      .set("Authorization", `${adminToken}`)
      .send(newComment);

    expect(res.status).toEqual(201);
  });
  it("should return 404 if id of the blog not found ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/add-comment/${fakeBlogId}`)
      .set("Authorization", `${adminToken}`)
      .send(newComment);

    expect(res.status).toEqual(404);
  });
  it("should  return 401 if a user not logged in ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/add-comment/${blogId}`)
      .set("Authorization", `${ftoken}`)
      .send(newComment);

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });
  //   =======================liking-===================================
  it("LIKING ,should return 404 if id of the blog to be liked not found ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/like/${fakeBlogId}`)
      .set("Authorization", `${adminToken}`)
      .send(newComment);

    expect(res.status).toEqual(404);
  });
  it("should  return 401 if a user not logged in in order to like", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/like/${blogId}`)
      .set("Authorization", `${ftoken}`)
      .send(newComment);

    expect(res.status).toEqual(401);
  });
  it("LIKING ,should return 201 if a user  liked succesfully this blog ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/like/${blogId}`)
      .set("Authorization", `${adminToken}`)
      .send(newComment);

    expect(res.status).toEqual(201);
  });
  it("LIKING ,should return 400 if a user have already liked this blog ", async () => {
    const newComment = {
      comment: "my comment",
    };

    const res = await request
      .post(`/api/com/like/like/${blogId}`)
      .set("Authorization", `${adminToken}`)
      .send(newComment);

    expect(res.status).toEqual(400);
    await User.findByIdAndDelete(users._id);
  });
});
