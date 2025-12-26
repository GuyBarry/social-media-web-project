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
  Post.deleteMany().exec();
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
});
