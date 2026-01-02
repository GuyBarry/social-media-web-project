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
  if (!(await Post.exists({ _id: examplePost._id }))) {
    await Post.create(examplePost);
  }
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
});
