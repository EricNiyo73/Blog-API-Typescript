import supertest from "supertest";
import app from "./index.test";
import Message from "../Models/messageModel";
import User from "../Models/userModel";
import { userInfo } from "os";
import fs from "fs";
import path from "path";
const request = supertest(app);
import { createServer, Server } from "http";

let server: Server;

beforeAll((done) => {
  server = createServer(app);
  server.listen(6000, done);
});

afterAll((done) => {
  server.close(done);
});
