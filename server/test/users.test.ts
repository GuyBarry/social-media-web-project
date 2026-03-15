import { Express } from "express";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import path from "path";
import request from "supertest";
import { UPLOAD_DIR } from "../pictures/pictures.config";
import { initApp } from "../app";
import { authService } from "../auth/auth.service";
import { User } from "../entities/dto/user.dto";
import { LikeModel } from "../entities/mongodb/like.module";
import { PostModel } from "../entities/mongodb/post.module";
import { UserModel } from "../entities/mongodb/user.module";
import { cleanupTestPictures, exampleLike, examplePost, exampleUser, getAuthCookies, loginUser } from "./testUtils";

let app: Express;
let authCookies: string[];

const TEST_PNG = path.resolve(__dirname, "resources/test.png");

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;

    const { accessToken } = authService.buildLoginTokens(loginUser._id);
    authCookies = getAuthCookies(accessToken.token);

    if (!(await UserModel.exists({ _id: loginUser._id }))) {
      await UserModel.create(loginUser);
    }
  });
});

beforeEach(async () => {
  await UserModel.deleteMany();
  await UserModel.create(loginUser);
  await UserModel.create(exampleUser);
});

afterAll(async () => {
  await cleanupTestPictures();
  await mongoose.connection.close();
});

describe("GET /", () => {
  test("Should return all users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body.map(({ _id }: User) => _id)).toEqual(
      expect.arrayContaining([exampleUser._id, loginUser._id])
    );
  });

  test("Should not expose password or googleId fields", async () => {
    const response = await request(app)
      .get("/users")
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    response.body.forEach((user: Record<string, unknown>) => {
      expect(user).not.toHaveProperty("password");
      expect(user).not.toHaveProperty("googleId");
    });
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app).get("/users");

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});

describe("GET /:id", () => {
  test("Should return a user by id", async () => {
    const response = await request(app)
      .get(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body._id).toBe(exampleUser._id);
  });

  test("Should return postsCount and likesCount for a user with posts and likes", async () => {
    await PostModel.deleteMany();
    await LikeModel.deleteMany();
    await PostModel.create(examplePost);
    await LikeModel.create(exampleLike);

    const response = await request(app)
      .get(`/users/${loginUser._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.postsCount).toBe(1);
    expect(response.body.likesCount).toBe(1);
  });

  test("Should return postsCount 0 and likesCount 0 for a user with no posts", async () => {
    const response = await request(app)
      .get(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.postsCount).toBe(0);
    expect(response.body.likesCount).toBe(0);
  });

  test("Should return 404 when user does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .get(`/users/${nonExistentId}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app).get(`/users/${exampleUser._id}`);

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});

describe("POST /users", () => {
  test("Should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send({
        username: "New User",
        email: "new@example.com",
        bio: "This is a new user",
        birthDate: "1990-01-01",
        password: "newuserpassword",
      });

    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(response.body.message).toBe("Created new user");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("createdAt");

    const createdUser = await UserModel.findById(response.body.userId);
    expect(createdUser).not.toBeNull();
    expect(createdUser!.username).toBe("New User");
    expect(createdUser!.email).toBe("new@example.com");
    expect(createdUser!.uniqueUsername).toMatch(/^newuser#\d{4}$/);
  });

  test("Should return 400 for missing username field", async () => {
    const invalidUserData = {
      email: "test@example.com",
      bio: "This user has no username",
      birthDate: "1990-01-01",
      password: "newuserpassword",
    };
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for invalid birth date format", async () => {
    const invalidUserData = {
      username: "Test User",
      email: "test@example.com",
      bio: "Invalid birth date format",
      birthDate: "invalid-date",
      password: "newuserpassword",
    };
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for missing password field", async () => {
    const invalidUserData = {
      username: "Test User",
      email: "test@example.com",
      bio: "This user has no password",
      birthDate: "1990-01-01",
    };
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for missing email field", async () => {
    const invalidUserData = {
      username: "Test User",
      bio: "This user has no email",
      birthDate: "1990-01-01",
      password: "newuserpassword",
    };
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 400 for invalid email format", async () => {
    const invalidUserData = {
      username: "Test User",
      email: "invalid-email",
      bio: "Invalid email format",
      birthDate: "1990-01-01",
      password: "newuserpassword",
    };
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 409 if user already exists", async () => {
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send(exampleUser);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    expect(response.body.details.field).toBe("_id");
    expect(response.body.details.value).toBe(exampleUser._id);
  });

  test("Should return 409 if email is already taken by another user", async () => {
    const response = await request(app)
      .post("/users")
      .set("Cookie", authCookies)
      .send({
        username: "Brand New User",
        email: exampleUser.email,
        birthDate: "1990-01-01",
        password: "somepassword",
      });

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    expect(response.body.details.field).toBe("email");
    expect(response.body.details.value).toBe(exampleUser.email);
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app).post("/users").send({
      username: "Ghost User",
      email: "ghost@example.com",
      birthDate: "1990-01-01",
      password: "ghostpassword",
    });

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});

describe("PUT /users/:id", () => {
  test("Should update an existing user", async () => {
    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("username", "Updated User")
      .field("bio", "This is an updated bio");

    expect(response.statusCode).toEqual(StatusCodes.OK);

    const updatedUser = await UserModel.findById(exampleUser._id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.username).toBe("Updated User");
    expect(updatedUser!.bio).toBe("This is an updated bio");
    expect(updatedUser!.uniqueUsername).toMatch(/^updateduser#\d{4}$/);
  });

  test("Should return 404 when updating a non-existent user", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .put(`/users/${nonExistentId}`)
      .set("Cookie", authCookies)
      .field("bio", "This user does not exist");

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should return 400 for invalid update data", async () => {
    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("username", "");

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 409 when updating to an existing user's email", async () => {
    const uniqueEmail = "unique@example.com";
    const anotherUser = await UserModel.create({
      _id: "2222",
      username: "anotheruser",
      uniqueUsername: "anotheruser#0002",
      email: uniqueEmail,
      bio: "This is another user",
      birthDate: "1995-05-05",
      password: "anotherpassword",
    });

    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("email", anotherUser.email);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    expect(response.body.details.field).toBe("email");
    expect(response.body.details.value).toBe(uniqueEmail);
  });

  test("Should not change uniqueUsername when username is not updated", async () => {
    const originalUniqueUsername = exampleUser.uniqueUsername;

    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("bio", "Updated bio without changing username");

    expect(response.statusCode).toEqual(StatusCodes.OK);

    const updatedUser = await UserModel.findById(exampleUser._id);
    expect(updatedUser!.uniqueUsername).toBe(originalUniqueUsername);
  });

  test("Should update the birthDate of an existing user", async () => {
    const newBirthDate = "1985-06-15";
    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("birthDate", newBirthDate);

    expect(response.statusCode).toEqual(StatusCodes.OK);

    const updatedUser = await UserModel.findById(exampleUser._id);
    expect(updatedUser).not.toBeNull();
    expect(new Date(updatedUser!.birthDate!).toISOString().startsWith("1985-06-15")).toBe(true);
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .field("bio", "Should not work");

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });

  describe("banner color update", () => {
    test("Should update banner color with a valid palette key (1–9)", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bannerColor", "5");

      expect(response.statusCode).toEqual(StatusCodes.OK);

      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.bannerColor).toBe("5");
    });

    test("Should update banner color with a valid hex code", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bannerColor", "#a1b2c3");

      expect(response.statusCode).toEqual(StatusCodes.OK);

      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.bannerColor).toBe("#a1b2c3");
    });

    test("Should update banner color with a short hex code", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bannerColor", "#fff");

      expect(response.statusCode).toEqual(StatusCodes.OK);

      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.bannerColor).toBe("#fff");
    });

    test("Should return 400 for an invalid banner color value", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bannerColor", "notacolor");

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe("Invalid request body");
      expect(response.body.violations).toBeDefined();
    });

    test("Should return 400 for palette key 0 (out of range)", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bannerColor", "0");

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe("Invalid request body");
    });

    test("New user should have default banner color of '1'", async () => {
      const createResponse = await request(app)
        .post("/users")
        .set("Cookie", authCookies)
        .send({
          username: "bannerdefaultuser",
          email: "bannerdefault@example.com",
          birthDate: "1990-01-01",
          password: "somepassword",
        });

      expect(createResponse.statusCode).toEqual(StatusCodes.CREATED);

      const createdUser = await UserModel.findById(createResponse.body.userId);
      expect(createdUser?.bannerColor).toBe("1");
    });
  });

  describe("picture update", () => {
    const OLD_PICTURE_FILENAME = "old-user-picture.png";
    const oldPicturePath = path.join(UPLOAD_DIR, OLD_PICTURE_FILENAME);

    beforeEach(async () => {
      // Place a real file on disk so deleteFile can unlink it
      await fs.copyFile(TEST_PNG, oldPicturePath);
      // Point the seeded user's image at that file
      await UserModel.findByIdAndUpdate(exampleUser._id, {
        imageUrl: `http://localhost/public/${OLD_PICTURE_FILENAME}`,
      });
    });

    afterEach(async () => {
      // Clean up in case the test did not delete it
      await fs.unlink(oldPicturePath).catch(() => undefined);
    });

    test("Should update the picture of an existing user", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .attach("image", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.OK);

      // Old file should have been removed from disk
      await expect(fs.access(oldPicturePath)).rejects.toThrow();

      // Persisted image URL should now point at the newly uploaded file
      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.imageUrl).not.toBe(
        `http://localhost/public/${OLD_PICTURE_FILENAME}`,
      );
      expect(updatedUser?.imageUrl).toMatch(/\/public\/.+\.png$/);
    });

    test("Should update both bio and picture", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("bio", "Updated bio with new picture")
        .attach("image", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.OK);

      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.bio).toBe("Updated bio with new picture");
      expect(updatedUser?.imageUrl).toMatch(/\/public\/.+\.png$/);
    });

    test("Should return 404 when updating picture of a non-existent user", async () => {
      const response = await request(app)
        .put(`/users/nonexistentid`)
        .set("Cookie", authCookies)
        .attach("image", TEST_PNG);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("User does not exist");
    });

    test("Should remove picture when imageUrl is set to empty string", async () => {
      const response = await request(app)
        .put(`/users/${exampleUser._id}`)
        .set("Cookie", authCookies)
        .field("imageUrl", "");

      expect(response.statusCode).toEqual(StatusCodes.OK);

      // Old file should have been removed from disk
      await expect(fs.access(oldPicturePath)).rejects.toThrow();

      const updatedUser = await UserModel.findById(exampleUser._id);
      expect(updatedUser?.imageUrl).toBe("");
    });
  });
});

describe("DELETE /:id", () => {
  test("Should delete a user", async () => {
    const response = await request(app)
      .delete(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body.userId).toBe(exampleUser._id);

    const deletedUser = await UserModel.findById(exampleUser._id);
    expect(deletedUser).toBeNull();
  });

  test("Should return 404 when deleting a non-existent user", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .delete(`/users/${nonExistentId}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should return 401 when not authenticated", async () => {
    const response = await request(app).delete(`/users/${exampleUser._id}`);

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});
