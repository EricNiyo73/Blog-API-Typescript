import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../Models/userModel";
import Sub from "../Models/subscribersModel";
import supertest from "supertest";
import app from "./index.test";
const request = supertest(app);
import { createServer, Server } from "http";

let server: Server;

beforeAll((done) => {
  server = createServer(app);
  server.listen(9000, done);
});

afterAll((done) => {
  User.deleteMany({});
  Sub.deleteMany({});
  server.close(done);
});
describe(" messages api testing", () => {
  const subs = new Sub({
    email: "test4@example.com",
  });
  subs.save();
  const users = new User({
    email: "subscriber1@test.com",
    fullName: "test",
    password: "password",
    userRole: "admin",
  });
  users.save();

  let adminT = jwt.sign({ id: users._id }, process.env.JWT_SECRET || "", {
    expiresIn: "20h",
  });

  it("should  add a subscriber and return success ", async () => {
    const newSub = {
      email: "test2@example.com",
    };
    const res = await request.post("/api/subscribe/create/").send(newSub);
    expect(res.status).toEqual(201);
  });
  it("should return 409 if a subscriber already exist ", async () => {
    const newSub = {
      email: "test1@example.com",
    };
    const res = await request.post("/api/subscribe/create/").send(newSub);
    expect(res.status).toEqual(409);
  });
  it("should  retrieve all  subscriber  and return success ", async () => {
    const res = await request
      .get("/api/subscribe/")
      .set("Authorization", ` ${adminT}`);
    expect(res.status).toEqual(200);
    // await User.findByIdAndDelete(users._id);
    // await Sub.findByIdAndDelete(subs._id);
  });
});
