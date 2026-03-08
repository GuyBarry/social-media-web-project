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
import { UserModel } from "../entities/mongodb/user.module";
import { cleanupTestPictures, exampleUser, getAuthCookies, loginUser } from "./testUtils";

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
});

describe("GET /:id", () => {
  test("Should return a user by id", async () => {
    const response = await request(app)
      .get(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body._id).toBe(exampleUser._id);
  });

  test("Should return 404 when user does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .get(`/users/${nonExistentId}`)
      .set("Cookie", authCookies);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
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

  test("Should return 409 when updating to an existing user's username", async () => {
    const uniqueUsername = "uniqueusername";
    const anotherUser = await UserModel.create({
      _id: "3333",
      username: uniqueUsername,
      email: "unique@example.com",
      bio: "This is another user",
      birthDate: "1995-05-05",
      password: "password",
    });

    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set("Cookie", authCookies)
      .field("username", anotherUser.username);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    expect(response.body.details.field).toBe("username");
    expect(response.body.details.value).toBe(uniqueUsername);
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
});
