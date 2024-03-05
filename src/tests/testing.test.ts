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

describe("POST /api/users/signup", () => {
  const userId: string = "65e6ccd281ec360c9152db36";
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
      email: "testz@test.com",
      password: "password",
    });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("message");
  });
  it("should return 409 Email  already exists", async () => {
    const res = await request.post("/api/users/signup").send({
      fullName: "test",
      email: "testz@test.com",
      password: "password",
    });

    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty("message");
  });
  it("should get a user", async () => {
    const res = await request.get(`/api/users/${userId}`).send({
      fullName: "test",
      email: "test7@test.com",
      password: "password",
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });
  it("should get a user", async () => {
    const res = await request.get(`/api/users`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    // expect(res.body).toHaveProperty("message");
  });
  // =============================update user=====================================

  it("should return 400 for validating update inputs", async () => {
    const res = await request.put(`/api/users/${userId}`).send({
      email: "invalid",
      password: "123456789",
    });
    expect(res.status).toEqual(400);
    expect(res.text).toContain('"email" must be a valid email');
  });

  it("should PUT a user and return succesful message", async () => {
    const res = await request.put(`/api/users/${userId}`).send({
      fullName: "test",
      email: "test7@test.com",
      password: "password",
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });
  it("should delete a user by the given id", async () => {
    const res = await request.delete(`/api/users/${userId}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
  it("should return 404 if user  to be updated not found", async () => {
    const res = await request.put(`/api/users/${userId}`).send({
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
    const res = await request.delete(`/api/users/${userId}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      status: "failed",
      message: "Id of a User not found",
    });
  });
  it("should return 500 if user not found", async () => {
    const res = await request.get(`/api/users/${userId}`);
    expect(res.status).toEqual(404);
  });
});

describe("POST /api/users/login", () => {
  let token: string;

  it("should log in a user", async () => {
    const res = await request.post("/api/users/login").send({
      email: "test3@test.com",
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
      email: "test3@test.com",
      password: "passwordd",
    });

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });
});

// =======================================blogs===================================

describe("Blogs api testing", () => {
  const bid = "65e6b8604348275e68256c36";
  const filePath = path.join(__dirname, "testImage.png");
  let btoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTVjYWUxZDRlNTNmZWVmZTUyM2ZlYSIsImlhdCI6MTcwOTU1ODQ5NywiZXhwIjoxNzA5OTkwNDk3fQ.BD_w7V19jz1vzT2GzTe45F1XAj1RY3ARwnaoixyBgCE";

  it("should  add a blog and return success ", async () => {
    const newBlog = {
      title: "Testzf blog",
      description: "test desc blog",
      image: "testImage.png",
    };

    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${btoken}`)
      .attach("image", filePath)
      .field("title", newBlog.title)
      .field("description", newBlog.description);

    expect(res.status).toEqual(201);
  });
  it("should  return 409 if blog title already exist ", async () => {
    const newBlog = {
      title: "Testzf blog",
      description: "test2 desc blog",
      image: "testImage.png",
    };

    const res = await request
      .post("/api/blogs/create")
      .set("Authorization", `${btoken}`)
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
      .set("Authorization", `${btoken}`)
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
      .set("Authorization", `${btoken}`)
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
    const res = await request.get(`/api/blogs/${bid}`);
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
      .put(`/api/blogs/${bid}`)
      .set("Authorization", `${btoken}`)
      .attach("image", filePath)
      .field("title", updateBlog.title)
      .field("description", updateBlog.description);

    expect(res.status).toEqual(200);
  });
  it("should  delete a blog and return success ", async () => {
    const res = await request
      .delete(`/api/blogs/${bid}`)
      .set("Authorization", ` ${btoken}`);
    expect(res.status).toEqual(204);
  });
  it("UPDATE ,updating a Blog with invalid id, ", async () => {
    const updateBlog = {
      title: "updated blog",
      description: "updted desc blog",
      image: "testImage.png",
    };

    const res = await request
      .put(`/api/blogs/${bid}`)
      .set("Authorization", `${btoken}`)
      .attach("image", filePath)
      .field("title", updateBlog.title)
      .field("description", updateBlog.description);

    expect(res.status).toEqual(404);
  });
  it("should return 404 if id to be returned not found", async () => {
    const res = await request.get(`/api/blogs/${bid}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a Blog not found",
    });
  });
  it("should return 404 if id tobe deleted not found", async () => {
    const res = await request
      .delete(`/api/blogs/${bid}`)
      .set("Authorization", ` ${btoken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a Blog not found",
    });
  });
});

// ====================================messages================================
describe(" messages api testing", () => {
  const sid = "65e5998d12c9f74c4ce6c4d9";
  let mtoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTVjYWUxZDRlNTNmZWVmZTUyM2ZlYSIsImlhdCI6MTcwOTU1ODQ5NywiZXhwIjoxNzA5OTkwNDk3fQ.BD_w7V19jz1vzT2GzTe45F1XAj1RY3ARwnaoixyBgCE";
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
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(200);
  });
  it("should retrieve a single message and return success ", async () => {
    const res = await request
      .get(`/api/messages/${sid}`)
      .set("Authorization", `${mtoken}`);
    expect(res.status).toEqual(200);
  });
  it("should  delete a message and return success ", async () => {
    const res = await request
      .delete(`/api/messages/${sid}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(204);
  });
  it("should return 404 if id to be returned not found", async () => {
    const res = await request
      .get(`/api/messages/${sid}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "message not found",
    });
  });
  it("should return 404 if id tobe deleted not found", async () => {
    const res = await request
      .delete(`/api/messages/${sid}`)
      .set("Authorization", ` ${mtoken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      message: "Id of a message not found",
    });
  });
});
