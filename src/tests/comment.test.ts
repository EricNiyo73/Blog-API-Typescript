import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import authMiddleware from "../Middlewares/mustHaveAccount";
import checkAdmin from "../Middlewares/checkAdmin";
import User from "../Models/userModel";
import { createServer, Server } from "http";
import app from "./index.test";
import supertest from "supertest";
import Message from "../Models/messageModel";

const request = supertest(app);

let server: Server;

beforeAll((done) => {
  server = createServer(app);
  server.listen(7000, done);
});

afterAll((done) => {
  server.close(done);
});
describe(" messages api testing", () => {
  const message = new Message({
    fullName: "Test yyhhykkmessage",
    email: "test1@example.com",
    messageContent: "Test message content",
  });
  message.save();
  const sid = "65e5c9c55d36c4f8fc995df8";
  let mtoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTVjYWUxZDRlNTNmZWVmZTUyM2ZlYSIsImlhdCI6MTcwOTU1ODQ5NywiZXhwIjoxNzA5OTkwNDk3fQ.BD_w7V19jz1vzT2GzTe45F1XAj1RY3ARwnaoixyBgCE";
  it("should  add a message and return success ", async () => {
    const newMessage = {
      fullName: "gutesitinga",
      email: "gtesitinga@example.com",
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
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(200);
  });
  it("should retrieve a single message and return success ", async () => {
    const res = await request
      .get(`/api/messages/${message._id}`)
      .set("Authorization", `${mtoken}`);
    expect(res.status).toEqual(200);
  });
  it("should  delete a message and return success ", async () => {
    const res = await request
      .delete(`/api/messages/${message._id}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(204);
  });
  it("should return 404 if id to be returned not found", async () => {
    const res = await request
      .get(`/api/messages/${message._id}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "message not found",
    });
  });
  it("should return 404 if id tobe deleted not found", async () => {
    const res = await request
      .delete(`/api/messages/${message._id}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a message not found",
    });
  });
});
