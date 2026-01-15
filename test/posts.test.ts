import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app";
import { PostModel } from "../entities/mongodb/post.module";
import { examplePost, getAuthHeader, loginUser } from "./testUtils";
import { authService } from "../auth/auth.service";
import { UserModel } from "../entities/mongodb/user.module";

let app: Express;
let loginHeaders: Record<string, string>;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;

    const { accessToken } = authService.buildLoginTokens(loginUser._id);
    loginHeaders = getAuthHeader(accessToken);
    if (!(await UserModel.exists({ _id: loginUser._id }))) {
      await UserModel.create(loginUser);
    }
  });
});

beforeEach(async () => {
  await PostModel.deleteMany();
  await PostModel.create(examplePost);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET / ", () => {
  test("Should return all posts", async () => {
    const response = await request(app).get("/posts").set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toBe(examplePost._id);
  });

  test("Should return empty array when no posts exist", async () => {
    await PostModel.deleteMany();

    const response = await request(app).get("/posts").set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);
  });

  describe("GET /?sender=", () => {
    test("Should return posts by sender", async () => {
      const response = await request(app)
        .get(`/posts?sender=${examplePost.sender}`)
        .set(loginHeaders);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]._id).toBe(examplePost._id);
      expect(response.body[0].sender._id).toBe(examplePost.sender);
    });

    test("Should return empty array when no posts exist for sender", async () => {
      const response = await request(app)
        .get(`/posts?sender=unknownuser`)
        .set(loginHeaders);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(0);
    });

    test("Should return all posts when sender is null", async () => {
      const response = await request(app)
        .get(`/posts?sender=`)
        .set(loginHeaders);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

describe("GET /:id", () => {
  test("Should return a post by id", async () => {
    const response = await request(app)
      .get(`/posts/${examplePost._id}`)
      .set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body._id).toBe(examplePost._id);
  });

  test("Should return 404 when post does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .get(`/posts/${nonExistentId}`)
      .set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Post does not exist");
  });
});

describe("POST / ", () => {
  test("Should create a new post", async () => {
    const newPostData = {
      message: "This is a new test post",
      sender: "testuser",
    };
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send(newPostData);
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(response.body.message).toBe("Created new post");
    expect(response.body.postId).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  test("Should return 400 for missing sender field", async () => {
    const invalidPostData = {
      message: "This post has no sender",
    };
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send(invalidPostData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for missing message field", async () => {
    const invalidPostData = {
      sender: "testuser",
    };
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send(invalidPostData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for empty post data", async () => {
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send({});
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for non-existing fields", async () => {
    const invalidPostData = {
      notExistingField: "some value",
      message: "This is a new test post",
      sender: "testuser",
    };
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send(invalidPostData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 409 for duplicate post", async () => {
    const duplicatePostData = {
      _id: examplePost._id,
      message: examplePost.message,
      sender: examplePost.sender,
    };
    const response = await request(app)
      .post("/posts")
      .set(loginHeaders)
      .send(duplicatePostData);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("Post already exists");
    expect(response.body.details.field).toBe("_id");
    expect(response.body.details.value).toBe(examplePost._id);
  });
});

describe("GET /invalid-endpoint", () => {
  test("Should return 404 for invalid endpoint", async () => {
    const response = await request(app)
      .get("/invalid-endpoint")
      .set(loginHeaders);
    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Route does not exist");
  });
});

describe("PUT /:id", () => {
  test("Should update an existing post", async () => {
    const updatedPostData = {
      message: "This is an updated test post",
    };
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set(loginHeaders)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toBe("Updated post");
    expect(response.body.postId).toBe(examplePost._id);
    expect(response.body.updatedAt).toBeDefined();
  });

  test("Should return 404 when updating a non-existent post", async () => {
    const nonExistentId = "nonexistentid";
    const updatedPostData = {
      message: "This post does not exist",
    };
    const response = await request(app)
      .put(`/posts/${nonExistentId}`)
      .set(loginHeaders)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Post does not exist");
  });

  test("Should return 400 for invalid update data", async () => {
    const updatedPostData = {
      message: "",
    };
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set(loginHeaders)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for non-existing fields in update data", async () => {
    const updatedPostData = {
      notExistingField: "some value",
      message: "This is an updated test post",
    };
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set(loginHeaders)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for empty update data", async () => {
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set(loginHeaders)
      .send({});

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("should return 400 for trying to update sender", async () => {
    const updatedPostData = {
      sender: "newSender",
    };
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set(loginHeaders)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });
});
