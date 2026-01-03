import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app.js";
import { Comment } from "../entities/mongodb/comment.module.js";
import { exampleComment } from "./testUtils.js";

let app;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
  });
  await Comment.deleteMany();
});

beforeEach(async () => {
  await Comment.deleteMany();
  await Comment.create(exampleComment);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET / ", () => {
  test("Should return all comments", async () => {
    const response = await request(app).get("/comments");

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toBe(exampleComment._id);
  });

  test("Should return empty array when no comments exist", async () => {
    await Comment.deleteMany();
    const response = await request(app).get("/comments");

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);
  });

  describe("GET /?postId=", () => {
    test("Should return comments by postId", async () => {
      const response = await request(app).get(
        `/comments?postId=${exampleComment.postId}`
      );

      expect(response.statusCode).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]._id).toBe(exampleComment._id);
      expect(response.body[0].postId).toBe(exampleComment.postId);
    });
    
    test("Should return empty array when no comments exist for postId", async () => {
      const response = await request(app).get(`/comments?postId=nonexistentid`);

      expect(response.statusCode).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(0);
    });
  });
});
