import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app.js";
import { Post } from "../entities/mongodb/post.module.js";
import { examplePost } from "./testUtils.js";

let app;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
  });
  await Post.deleteMany();
});

beforeEach(async () => {
  await Post.deleteMany();
  await Post.create(examplePost);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET / ", () => {
  test("Should return all posts", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toBe(examplePost._id);
  });

  test("Should return empty array when no posts exist", async () => {
    await Post.deleteMany();

    const response = await request(app).get("/posts");

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);
  });
});

describe("GET /:id", () => {
  test("Should return a post by id", async () => {
    const response = await request(app).get(`/posts/${examplePost._id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body._id).toBe(examplePost._id);
  });

  test("Should return 404 when post does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app).get(`/posts/${nonExistentId}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toBe("Post does not exist");
  });
});

describe("POST / ", () => {
  test("Should create a new post", async () => {
    const newPostData = {
      message: "This is a new test post",
      sender: "testuser",
    };
    const response = await request(app).post("/posts").send(newPostData);
    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toBe("created new post");
    expect(response.body.postId).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  test("Should return 400 for missing sender field", async () => {
    const invalidPostData = {
      message: "This post has no sender",
    };
    const response = await request(app).post("/posts").send(invalidPostData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for missing message field", async () => {
    const invalidPostData = {
      sender: "testuser",
    };
    const response = await request(app).post("/posts").send(invalidPostData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for empty post data", async () => {
    const response = await request(app).post("/posts").send({});
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for non-existing fields", async () => {
    const invalidPostData = {
      notExistingField: "some value",
      message: "This is a new test post",
      sender: "testuser",
    };
    const response = await request(app).post("/posts").send(invalidPostData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });
});

describe("GET /invalid-endpoint", () => {
  test("Should return 404 for invalid endpoint", async () => {
    const response = await request(app).get("/invalid-endpoint");
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toBe("Route does not exist");
  });
});

describe("PUT /:id", () => {
  test("Should update an existing post", async () => {
    const updatedPostData = {
      message: "This is an updated test post",
      sender: "updateduser",
    };
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .send(updatedPostData);
      console.log(response);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe("updated post");
    expect(response.body.postId).toBe(examplePost._id);
    expect(response.body.updatedAt).toBeDefined();
  });

  test("Should return 404 when updating a non-existent post", async () => {
    const nonExistentId = "nonexistentid";
    const updatedPostData = {
      message: "This post does not exist",
      sender: "noone",
    };
    const response = await request(app)
      .put(`/posts/${nonExistentId}`)
      .send(updatedPostData);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toBe("Post does not exist");
    expect(response.body.postId).toBe(nonExistentId);
  });
});
