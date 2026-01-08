import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app.js";
import { Comment } from "../entities/mongodb/comment.module.js";
import { exampleComment, examplePost } from "./testUtils.js";

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

describe("POST / ", () => {
  test("Should create a new comment", async () => {
    const newCommentData = {
      sender: "Alice",
      message: "Great post!",
      postId: examplePost._id,
    };

    const response = await request(app).post("/comments").send(newCommentData);

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toBe("created new comment");
    expect(response.body).toHaveProperty("commentId");
    expect(response.body).toHaveProperty("createdAt");

    const createdComment = await Comment.findById(response.body.commentId);
    expect(createdComment).not.toBeNull();
    expect(createdComment.sender).toBe(newCommentData.sender);
    expect(createdComment.message).toBe(newCommentData.message);
    expect(createdComment.postId).toBe(newCommentData.postId);
  });

  test("Should not create a new comment with invalid sender", async () => {
    const invalidCommentData = {
      sender: "",
      message: "Great post!",
      postId: examplePost._id,
    };

    const response = await request(app)
      .post("/comments")
      .send(invalidCommentData);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should not create a new comment with invalid message", async () => {
    const invalidCommentData = {
      sender: "Alice",
      message: "",
      postId: examplePost._id,
    };

    const response = await request(app)
      .post("/comments")
      .send(invalidCommentData);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should not create a new comment if post does not exist", async () => {
    const newCommentData = {
      sender: "Alice",
      message: "Great post!",
      postId: "nonexistentid",
    };

    const response = await request(app)
      .post("/comments")
      .send(newCommentData)
      .set("Content-Type", "application/json");

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe("Post does not exist");
  });
});