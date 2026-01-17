import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app";
import { authService } from "../auth/auth.service";
import { UserModel } from "../entities/mongodb/user.module";
import { exampleUser, getAuthHeader, loginUser } from "./testUtils";
import { User } from "../entities/dto/user.dto";
import { _isoDateTime } from "zod/v4/core";

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
  await UserModel.deleteMany();
  await UserModel.create(loginUser);
  await UserModel.create(exampleUser);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /", () => {
  test("Should return all users", async () => {
    const response = await request(app).get("/users").set(loginHeaders);

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
      .set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body._id).toBe(exampleUser._id);
  });

  test("Should return 404 when user does not exist", async () => {
    const nonExistentId = "nonexistentid";
    const response = await request(app)
      .get(`/users/${nonExistentId}`)
      .set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });
});

describe("POST /users", () => {
  test("Should create a new user", async () => {
    const response = await request(app).post("/users").set(loginHeaders).send({
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
      .set(loginHeaders)
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
      .set(loginHeaders)
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
      .set(loginHeaders)
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
      .set(loginHeaders)
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
      .set(loginHeaders)
      .send(invalidUserData);
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });

  test("Should return 409 if user already exists", async () => {
    const response = await request(app)
      .post("/users")
      .set(loginHeaders)
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
      .set(loginHeaders)
      .send({
        username: "Updated User",
        bio: "This is an updated bio",
      });

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
      .set(loginHeaders)
      .send({ bio: "This user does not exist" });

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });

  test("Should return 400 for invalid update data", async () => {
    const invalidUpdateData = {
      username: "",
    };
    const response = await request(app)
      .put(`/users/${exampleUser._id}`)
      .set(loginHeaders)
      .send(invalidUpdateData);

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
      .set(loginHeaders)
      .send({ email: anotherUser.email });

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
      .set(loginHeaders)
      .send({ username: anotherUser.username });

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
    expect(response.body.details.field).toBe("username");
    expect(response.body.details.value).toBe(uniqueUsername);
  });
});

describe("DELETE /:id", () => {
  test("Should delete a user", async () => {
    const response = await request(app)
      .delete(`/users/${exampleUser._id}`)
      .set(loginHeaders);

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
      .set(loginHeaders);

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("User does not exist");
  });
});
