import { Express } from "express";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import path from "path";
import request from "supertest";
import { UPLOAD_DIR } from "../pictures/pictures.config";
import { initApp } from "../app";
import { authService } from "../auth/auth.service";
import { LikeModel } from "../entities/mongodb/like.module";
import { PostModel } from "../entities/mongodb/post.module";
import { UserModel } from "../entities/mongodb/user.module";
import { CommentModel } from "../entities/mongodb/comment.module";
import {
  cleanupTestPictures,
  exampleComment,
  exampleLike,
  examplePost,
  exampleUser,
  getAuthCookies,
  loginUser,
  truncateDatabase,
} from "./testUtils";

const TEST_PNG = path.resolve(__dirname, "resources/test.png");

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
  });
});

beforeEach(async () => {
  await PostModel.deleteMany();
  await LikeModel.deleteMany();
  await CommentModel.deleteMany();
  await PostModel.create(examplePost);
  await LikeModel.create(exampleLike);
});

afterAll(async () => {
  await cleanupTestPictures();
  await mongoose.connection.close();
});

describe("GET / ", () => {
  test("Should return all posts", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBeGreaterThan(0);
    expect(response.body.docs[0]._id).toBe(examplePost._id);
    expect(Array.isArray(response.body.docs[0].likes)).toBe(true);
    expect(response.body.docs[0].likes).toHaveLength(1);
    expect(response.body.docs[0].likes).toContain(loginUser._id);
    expect(response.body.docs[0].numComments).toBe(0);
    expect(response.body.totalDocs).toBe(1);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(response.body.totalPages).toBe(1);
  });

  test("Should return numComments reflecting the number of comments", async () => {
    await CommentModel.create(exampleComment);

    const response = await request(app)
      .get("/posts")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.docs[0].numComments).toBe(1);
  });

  test("Should return empty array when no posts exist", async () => {
    await PostModel.deleteMany();

    const response = await request(app)
      .get("/posts")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toEqual(0);
    expect(response.body.totalDocs).toBe(0);
    expect(response.body.totalPages).toBe(1);
  });

  test("Should return empty array of likes when no likes exist for a post", async () => {
    await LikeModel.deleteMany();

    const response = await request(app)
      .get("/posts")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBeGreaterThan(0);
    expect(Array.isArray(response.body.docs[0].likes)).toBe(true);
    expect(response.body.docs[0].likes).toHaveLength(0);
  });

  describe("GET /?sender=", () => {
    test("Should return posts by sender", async () => {
      const response = await request(app)
        .get(`/posts?sender=${examplePost.sender}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body.docs)).toBe(true);
      expect(response.body.docs.length).toBeGreaterThan(0);
      expect(response.body.docs[0]._id).toBe(examplePost._id);
      expect(response.body.docs[0].sender._id).toBe(examplePost.sender);
      expect(response.body.docs[0].numComments).toBe(0);
      expect(response.body.totalDocs).toBe(1);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    test("Should return numComments reflecting the number of comments when filtering by sender", async () => {
      await CommentModel.create(exampleComment);

      const response = await request(app)
        .get(`/posts?sender=${examplePost.sender}`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.docs[0].numComments).toBe(1);
    });

    test("Should return empty array when no posts exist for sender", async () => {
      const response = await request(app)
        .get(`/posts?sender=unknownuser`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body.docs)).toBe(true);
      expect(response.body.docs.length).toEqual(0);
      expect(response.body.totalDocs).toBe(0);
    });

    test("Should return all posts when sender is null", async () => {
      const response = await request(app)
        .get(`/posts?sender=`)
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(Array.isArray(response.body.docs)).toBe(true);
      expect(response.body.docs.length).toBeGreaterThan(0);
    });
  });

  describe("GET /?page=&limit=", () => {
    beforeEach(async () => {
      // Seed 5 total posts for pagination tests
      await PostModel.deleteMany();
      await PostModel.insertMany([
        { _id: "p1", sender: loginUser._id, message: "Post 1", picture: "http://localhost/public/1.png" },
        { _id: "p2", sender: loginUser._id, message: "Post 2", picture: "http://localhost/public/2.png" },
        { _id: "p3", sender: loginUser._id, message: "Post 3", picture: "http://localhost/public/3.png" },
        { _id: "p4", sender: loginUser._id, message: "Post 4", picture: "http://localhost/public/4.png" },
        { _id: "p5", sender: loginUser._id, message: "Post 5", picture: "http://localhost/public/5.png" },
      ]);
    });

    test("Should return first page with correct pagination metadata", async () => {
      const response = await request(app)
        .get("/posts?page=1&limit=2")
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.docs).toHaveLength(2);
      expect(response.body.totalDocs).toBe(5);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
      expect(response.body.totalPages).toBe(3);
    });

    test("Should return second page", async () => {
      const response = await request(app)
        .get("/posts?page=2&limit=2")
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.docs).toHaveLength(2);
      expect(response.body.page).toBe(2);
    });

    test("Should return last partial page", async () => {
      const response = await request(app)
        .get("/posts?page=3&limit=2")
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.docs).toHaveLength(1);
      expect(response.body.page).toBe(3);
      expect(response.body.totalPages).toBe(3);
    });

    test("Should return empty posts array when page exceeds totalPages", async () => {
      const response = await request(app)
        .get("/posts?page=99&limit=10")
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.docs).toHaveLength(0);
      expect(response.body.totalDocs).toBe(5);
    });

    test("Should default to page=1 and limit=10 when not provided", async () => {
      const response = await request(app)
        .get("/posts")
        .set("Cookie", authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body.docs).toHaveLength(5);
    });
  });
});

describe("GET /:id", () => {
  test("Should return a post by id", async () => {
    const response = await request(app)
      .get(`/posts/${examplePost._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body._id).toBe(examplePost._id);
    expect(Array.isArray(response.body.likes)).toBe(true);
    expect(response.body.likes).toHaveLength(1);
    expect(response.body.likes).toContain(loginUser._id);
    expect(response.body.numComments).toBe(0);
  });

  test("Should return numComments reflecting the number of comments", async () => {
    await CommentModel.create(exampleComment);

    const response = await request(app)
      .get(`/posts/${examplePost._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.numComments).toBe(1);
  });

  test("Should return 404 when post does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .get(`/posts/${nonExistentId}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Post does not exist");
  });
});

describe("POST / ", () => {
  test("Should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("message", "This is a new test post")
      .field("sender", loginUser._id)
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(response.body.message).toBe("Created new post");
    expect(response.body.postId).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  test("Should return 400 for missing sender field", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("message", "This post has no sender")
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for missing message field", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("sender", loginUser._id)
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for empty post data", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for non-existing fields", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("notExistingField", "some value")
      .field("message", "This is a new test post")
      .field("sender", loginUser._id)
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("should return 401 for auth token not equal to login user", async () => {
    await UserModel.create(exampleUser);

    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("message", "This is a new test post")
      .field("sender", exampleUser._id!)
      .attach("picture", TEST_PNG);

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("User is unauthorized");
  });

  test("should return 404 for non-existing sender", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("message", "This is a new test post")
      .field("sender", "nonexistinguser")
      .attach("picture", TEST_PNG);
    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should return 409 for duplicate post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Cookie", authCookies)
      .field("_id", examplePost._id!)
      .field("message", examplePost.message)
      .field("sender", examplePost.sender)
      .attach("picture", TEST_PNG);

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
      .set("Cookie", authCookies);
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
      .set("Cookie", authCookies)
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
      .set("Cookie", authCookies)
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
      .set("Cookie", authCookies)
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
      .set("Cookie", authCookies)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for empty update data", async () => {
    const response = await request(app)
      .put(`/posts/${examplePost._id}`)
      .set("Cookie", authCookies)
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
      .set("Cookie", authCookies)
      .send(updatedPostData);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  describe("picture update", () => {
    const OLD_PICTURE_FILENAME = "old-picture.png";
    const oldPicturePath = path.join(UPLOAD_DIR, OLD_PICTURE_FILENAME);

    beforeEach(async () => {
      // Place a real file on disk so deleteFile can unlink it
      await fs.copyFile(TEST_PNG, oldPicturePath);
      // Point the seeded post's picture at that file
      await PostModel.findByIdAndUpdate(examplePost._id, {
        picture: `http://localhost/public/${OLD_PICTURE_FILENAME}`,
      });
    });

    afterEach(async () => {
      // Clean up in case the test did not delete it
      await fs.unlink(oldPicturePath).catch(() => undefined);
    });

    test("Should update the picture of an existing post", async () => {
      const response = await request(app)
        .put(`/posts/${examplePost._id}`)
        .set("Cookie", authCookies)
        .attach("picture", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.message).toBe("Updated post");
      expect(response.body.postId).toBe(examplePost._id);
      expect(response.body.updatedAt).toBeDefined();

      // Old file should have been removed from disk
      await expect(fs.access(oldPicturePath)).rejects.toThrow();

      // Persisted picture URL should now point at the newly uploaded file
      const updatedPost = await PostModel.findById(examplePost._id);
      expect(updatedPost?.picture).not.toBe(
        `http://localhost/public/${OLD_PICTURE_FILENAME}`,
      );
      expect(updatedPost?.picture).toMatch(/\/public\/.+\.png$/);
    });

    test("Should update both message and picture", async () => {
      const response = await request(app)
        .put(`/posts/${examplePost._id}`)
        .set("Cookie", authCookies)
        .field("message", "Updated message with new picture")
        .attach("picture", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.message).toBe("Updated post");

      const updatedPost = await PostModel.findById(examplePost._id);
      expect(updatedPost?.message).toBe("Updated message with new picture");
      expect(updatedPost?.picture).toMatch(/\/public\/.+\.png$/);
    });

    test("Should return 404 when updating picture of a non-existent post", async () => {
      const response = await request(app)
        .put(`/posts/nonexistentid`)
        .set("Cookie", authCookies)
        .attach("picture", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("Post does not exist");
    });
  });
});

describe("PATCH /:id/like", () => {
  beforeEach(async () => {
    await LikeModel.deleteMany();
  });

  test("Should like a post", async () => {
    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "like" });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toBe("Post liked");
  });

  test("Should reflect liked userId in post likes array", async () => {
    await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "like" });

    const postResponse = await request(app)
      .get(`/posts/${examplePost._id}`)
      .set("Cookie", authCookies);

    expect(postResponse.body.likes).toContain(loginUser._id);
  });

  test("Should remove userId from post likes array after disliking", async () => {
    await LikeModel.create({ postId: examplePost._id, userId: loginUser._id });

    await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "dislike" });

    const postResponse = await request(app)
      .get(`/posts/${examplePost._id}`)
      .set("Cookie", authCookies);

    expect(postResponse.body.likes).not.toContain(loginUser._id);
  });

  test("Should dislike a post after liking it", async () => {
    await LikeModel.create({ postId: examplePost._id, userId: loginUser._id });

    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "dislike" });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toBe("Post disliked");
  });

  test("Should return 409 when liking a post already liked", async () => {
    await LikeModel.create({ postId: examplePost._id, userId: loginUser._id });

    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "like" });

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
  });

  test("Should return 404 when disliking a post that was not liked", async () => {
    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "dislike" });

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Like does not exist");
  });

  test("Should return 404 when liking a non-existent post", async () => {
    const response = await request(app)
      .patch(`/posts/nonexistentid/like`)
      .set("Cookie", authCookies)
      .send({ method: "like" });

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Post does not exist");
  });

  test("Should return 400 for invalid method value", async () => {
    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({ method: "upvote" });

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 when method field is missing", async () => {
    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .set("Cookie", authCookies)
      .send({});

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app)
      .patch(`/posts/${examplePost._id}/like`)
      .send({ method: "like" });

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});
