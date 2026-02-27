import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app";
import { authService } from "../auth/auth.service";
import { CommentModel } from "../entities/mongodb/comment.module";
import { PostModel } from "../entities/mongodb/post.module";
import { UserModel } from "../entities/mongodb/user.module";
import {
  exampleComment,
  examplePost,
  exampleUser,
  getAuthCookies,
  loginUser,
  truncateDatabase,
} from "./testUtils";

let app: Express;
let authCookies: string[];
beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    await truncateDatabase();

    const { accessToken } = authService.buildLoginTokens(loginUser._id);
    authCookies = getAuthCookies(accessToken.token);

    if (!(await UserModel.exists({ _id: loginUser._id }))) {
      await UserModel.create(loginUser);
    }
    if (!(await PostModel.exists({ _id: examplePost._id }))) {
      await PostModel.create(examplePost);
    }
  });
});

beforeEach(async () => {
  await CommentModel.deleteMany();
  await CommentModel.create(exampleComment);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET / ", () => {
  test("Should return all comments", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toBe(exampleComment._id);
  });

  test("Should return empty array when no comments exist", async () => {
    await CommentModel.deleteMany();
    const response = await request(app)
      .get("/comments")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);
  });

  describe("GET /?postId=", () => {
    test("Should return comments by postId", async () => {
      const response = await request(app)
        .get(`/comments?postId=${exampleComment.postId}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]._id).toBe(exampleComment._id);
      expect(response.body[0].postId).toBe(exampleComment.postId);
    });

    test("Should return empty array when no comments exist for postId", async () => {
      await CommentModel.deleteMany();
      const response = await request(app)
        .get(`/comments?postId=${examplePost._id}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(0);
    });

    test("Should return 404 when post does not exist", async () => {
      const response = await request(app)
        .get(`/comments?postId=nonexistentid`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("Post does not exist");
    });
  });

  describe("GET /:id", () => {
    test("Should return comment by id", async () => {
      const response = await request(app)
        .get(`/comments/${exampleComment._id}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(exampleComment._id);
      expect(response.body.postId).toBe(exampleComment.postId);
    });

    test("Should return 404 when comment does not exist", async () => {
      const nonExistentId = "nonexistentid";
      const response = await request(app)
        .get(`/comments/${nonExistentId}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("Comment does not exist");
    });
  });
});

describe("PUT /:id", () => {
  test("Should update an existing comment", async () => {
    const newMessage = { message: "This is an updated test message" };

    const response = await request(app)
      .put(`/comments/${exampleComment._id}`)
      .set("Cookie", authCookies)
      .send(newMessage);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toEqual("updated comment");
    expect(response.body.commentId).toEqual(exampleComment._id);

    const updated = await CommentModel.findById(exampleComment._id);
    expect(updated!.message).toEqual(newMessage.message);
    expect(response.body.updatedAt).toBeDefined();
  });

  test("Should return 400 when update body is invalid", async () => {
    const response = await request(app)
      .put(`/comments/${exampleComment._id}`)
      .set("Cookie", authCookies)
      .send({ message: "" });

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toEqual("Invalid request body");
    expect(Array.isArray(response.body.violations)).toBe(true);
    expect(response.body.violations.length).toBeGreaterThan(0);
  });

  test("Should return 400 when update body is invalid - empty string", async () => {
    const response = await request(app)
      .put(`/comments/${exampleComment._id}`)
      .set("Cookie", authCookies)
      .send({ message: 12345 });

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toEqual("Invalid request body");
    expect(Array.isArray(response.body.violations)).toBe(true);
    expect(response.body.violations.length).toBeGreaterThan(0);
  });

  test("Should return 400 when update body is missing - wrong type", async () => {
    const response = await request(app)
      .put(`/comments/${exampleComment._id}`)
      .set("Cookie", authCookies)
      .send({});
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toEqual("Invalid request body");
    expect(Array.isArray(response.body.violations)).toBe(true);
    expect(response.body.violations.length).toBeGreaterThan(0);
  });

  test("Should return 404 when updating non-existing comment", async () => {
    const response = await request(app)
      .put(`/comments/nonexistentid`)
      .set("Cookie", authCookies)
      .send({ message: "nope" });

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toEqual("Comment does not exist");
  });
});

describe("POST / ", () => {
  test("Should create a new comment", async () => {
    const newCommentData = {
      sender: loginUser._id,
      message: "Great post!",
      postId: examplePost._id,
    };

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(newCommentData);

    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(response.body.message).toBe("Created new comment");
    expect(response.body).toHaveProperty("commentId");
    expect(response.body).toHaveProperty("createdAt");

    const createdComment = await CommentModel.findById(response.body.commentId);
    expect(createdComment).not.toBeNull();
    expect(createdComment!.sender).toBe(newCommentData.sender);
    expect(createdComment!.message).toBe(newCommentData.message);
    expect(createdComment!.postId).toBe(newCommentData.postId);
  });

  test("should return 401 for auth token not equal to login user", async () => {
    await UserModel.create(exampleUser);

    const newPostData = {
      message: "This is a new test post",
      sender: exampleUser._id,
    };

    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .send(newPostData);

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("User is unauthorized");
  });

  test("should return 404 for non-existing sender", async () => {
    const invalidCommentData = {
      sender: "nonexistentid",
      message: "Great post!",
      postId: examplePost._id,
    };

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(invalidCommentData);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should not create a new comment with invalid sender", async () => {
    const invalidCommentData = {
      sender: "",
      message: "Great post!",
      postId: examplePost._id,
    };
    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(invalidCommentData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should not create a new comment with invalid message", async () => {
    const invalidCommentData = {
      sender: loginUser._id,
      message: "",
      postId: examplePost._id,
    };

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(invalidCommentData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should not create a new comment if post does not exist", async () => {
    const newCommentData = {
      sender: loginUser._id,
      message: "Great post!",
      postId: "nonexistentid",
    };

    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(newCommentData)
      .set("Content-Type", "application/json");

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Post does not exist");
  });

  test("Should return 409 when creating a duplicate comment", async () => {
    const duplicateCommentData = {
      _id: exampleComment._id,
      sender: exampleComment.sender,
      message: exampleComment.message,
      postId: exampleComment.postId,
    };
    const response = await request(app)
      .post("/comments")
      .set("Cookie", authCookies)
      .send(duplicateCommentData);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("Comment already exists");
    expect(response.body.details.field).toBe("_id");
    expect(response.body.details.value).toBe(exampleComment._id);
  });
});

describe("DELETE /:id", () => {
  test("should delete a comment", async () => {
    const response = await request(app)
      .delete(`/comments/${exampleComment._id}`)
      .set("Cookie", authCookies);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Comment deleted successfully");
    expect(response.body.commentId).toBe(exampleComment._id);

    const commentInDB = await CommentModel.findById(exampleComment._id);
    expect(commentInDB).toBeNull();
  });

  test("should return 404 when deleting a non-existent comment", async () => {
    const response = await request(app)
      .delete("/comments/nonexistentid")
      .set("Cookie", authCookies);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Comment does not exist");
  });
});
