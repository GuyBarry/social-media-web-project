import { Express, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { initApp } from "../app";
import { UserModel } from "../entities/mongodb/user.module";
import { REFRESH_TOKEN_COOKIE_KEY } from "../auth/auth.contoller";
import { serverConfig } from "../config/server.config";

let app: Express;

const testUser = {
  username: "AuthTestUser",
  email: "authtest@example.com",
  password: "password123",
  birthDate: "1990-01-01",
  bio: "Test bio",
};

beforeAll(async () => {
  app = await initApp();
});

beforeEach(async () => {
  await UserModel.deleteMany();
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
    expect(response.body.message).toBe("successfully registered!");
    expect(response.body.userId).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
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
    await request(app).post("/auth/registration").send(testUser);
  });

  test("Should login successfully with email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.accessToken).toBeDefined();

    validateRefreshTokenCookie(response);
  });

  test("Should login successfully with username", async () => {
    const response = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.accessToken).toBeDefined();

    validateRefreshTokenCookie(response);
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
  let accessToken: string;

  beforeEach(async () => {
    const res = await request(app).post("/auth/registration").send(testUser);
    accessToken = res.body.accessToken;
  });

  test("Should logout successfully", async () => {
    const response = await request(app)
      .post("/auth/logout")
        .set(serverConfig.authorizationHeader, `Bearer ${accessToken}`);

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
  let refreshTokenCookie: string;

  beforeEach(async () => {
    const res = await request(app).post("/auth/registration").send(testUser);
    const cookies = res.get("Set-Cookie") as string[];

    refreshTokenCookie =
      cookies.find((c: string) => c.startsWith(REFRESH_TOKEN_COOKIE_KEY)) || "";
  });

  test("Should refresh token successfully", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [refreshTokenCookie]);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.accessToken).toBeDefined();
  });

  test("Should return 401 if no refresh token provided", async () => {
    const response = await request(app).post("/auth/refresh");

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("User is unauthorized");
  });
});

const validateRefreshTokenCookie = (response: any) => {
  const rawCookie = response.get("Set-Cookie");
  expect(rawCookie).toBeDefined();

  const includesRefreshToken = (rawCookie as string[])[0].startsWith(
    REFRESH_TOKEN_COOKIE_KEY
  );

  expect(includesRefreshToken).toBeTruthy();
};
