import { hashSync } from "bcrypt";
import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from "../auth/auth.contoller";
import { authService } from "../auth/auth.service";
import { LoginTokens } from "../entities/dto/auth.dto";
import { UserModel } from "../entities/mongodb/user.module";
import { loginUser } from "./testUtils";
import { PASSWORD_SALT_ROUNDS } from "../users/users.service";

let app: Express;
let loginTokens: LoginTokens;

const testUser = {
  username: "AuthTestUser",
  email: "authtest@example.com",
  password: "password123",
  birthDate: "1990-01-01",
  bio: "Test bio",
};

beforeAll(async () => {
  app = await initApp();
  loginTokens = authService.buildLoginTokens(loginUser._id);
});

beforeEach(async () => {
  await UserModel.deleteMany();
  if (!(await UserModel.exists({ _id: loginUser._id }))) {
    await UserModel.create(loginUser);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /registration", () => {
  test("Should register a new user", async () => {
    const response = await request(app)
      .post("/auth/registration")
      .send(testUser);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.userId).toBeDefined();
  });

  test("Should return 409 if user already exists", async () => {
    await request(app).post("/auth/registration").send(testUser);
    const response = await request(app)
      .post("/auth/registration")
      .send(testUser);

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("User already exists");
  });

  test("Should return 400 for invalid data", async () => {
    const invalidUser = { ...testUser, email: "invalid-email" };
    const response = await request(app)
      .post("/auth/registration")
      .send(invalidUser);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Invalid request body");
    expect(response.body.violations).toBeDefined();
  });
});

describe("POST /login", () => {
  beforeEach(async () => {
    await UserModel.create({
      ...testUser,
      password: hashSync(testUser.password, PASSWORD_SALT_ROUNDS),
    });
  });

  test("Should login successfully with email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);

    validateTokenCookies(response);
  });

  test("Should login successfully with username", async () => {
    const response = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);

    validateTokenCookies(response);
  });

  test("Should return 401 for invalid password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });

  test("Should return 401 for non-existent user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: "password",
    });

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});

describe("POST /logout", () => {
  test("Should logout successfully", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Cookie", [
        `${ACCESS_TOKEN_COOKIE_KEY}=${loginTokens.accessToken.token}`,
      ]);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.message).toBe("User logged out");
  });

  test("Should return 401 if not authenticated", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("User is unauthorized");
  });
});

describe("POST /refresh", () => {
  test("Should refresh token successfully", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [
        `${REFRESH_TOKEN_COOKIE_KEY}=${loginTokens.refreshToken.token}`,
      ]);

    expect(response.statusCode).toEqual(StatusCodes.OK);
  });

  test("Should return 401 if no refresh token provided", async () => {
    const response = await request(app).post("/auth/refresh");

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("User is unauthorized");
  });
});

const validateTokenCookies = (response: any) => {
  const rawCookie = response.get("Set-Cookie");
  expect(rawCookie).toBeDefined();

  const tokenCookies = rawCookie as string[];
  expect(tokenCookies.length).toBe(2);

  const includesAccessToken = tokenCookies.some((cookie) =>
    cookie.startsWith(ACCESS_TOKEN_COOKIE_KEY)
  );

  const includesRefreshToken = tokenCookies.some((cookie) =>
    cookie.startsWith(REFRESH_TOKEN_COOKIE_KEY)
  );

  expect(includesAccessToken).toBeTruthy();
  expect(includesRefreshToken).toBeTruthy();
};
