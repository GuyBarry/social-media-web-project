import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";

jest.mock("../ai/ai.provider");

import { initApp } from "../app";
import { authService } from "../auth/auth.service";
import { PostModel } from "../entities/mongodb/post.module";
import { TrendingResultModel } from "../entities/mongodb/trendingResult.module";
import { UserModel } from "../entities/mongodb/user.module";
import { TrendingTimeRange } from "../trending/trending.constants";
import { TrendingResult } from "../entities/dto/trending.dto";
import { getAuthCookies, loginUser, truncateDatabase } from "./testUtils";
import { generateAIContent } from "../ai/ai.provider";

const mockGenerateAIContent = generateAIContent as jest.MockedFunction<
  typeof generateAIContent
>;


const MOCK_TOPICS: TrendingResult["topics"] = [
  { topicName: "Artificial Intelligence", shortSummary: "AI is everywhere" },
  { topicName: "Web Development", shortSummary: "New frameworks rising" },
  { topicName: "Cloud Computing", shortSummary: "Serverless on the rise" },
];

const mockAIWithTopics = () =>
  mockGenerateAIContent.mockResolvedValue(JSON.stringify(MOCK_TOPICS));

const mockAIFailure = () =>
  mockGenerateAIContent.mockRejectedValue(new Error("AI service error"));

const seedPost = (message: string, createdAt = new Date()) =>
  PostModel.create({
    _id: `post-${Date.now()}-${Math.random()}`,
    sender: loginUser._id,
    message,
    imageUrl: "http://localhost/public/test.png",
    createdAt,
    updatedAt: createdAt,
  });

const seedCachedResult = (
  timeRange: TrendingTimeRange,
  generatedAt = new Date(),
): Promise<TrendingResult> =>
  TrendingResultModel.create({
    topics: MOCK_TOPICS,
    generatedAt,
    timeRange,
  }).then((doc) => doc.toObject() as TrendingResult);

const postTrending = (app: Express, body: object, cookies: string[]) =>
  request(app).post("/trending").set("Cookie", cookies).send(body);


let app: Express;
let authCookies: string[];

beforeAll(async () => {
  app = await initApp();
  await truncateDatabase();

  const { accessToken } = authService.buildLoginTokens(loginUser._id);
  authCookies = getAuthCookies(accessToken.token);

  if (!(await UserModel.exists({ _id: loginUser._id }))) {
    await UserModel.create(loginUser);
  }
});

beforeEach(async () => {
  await PostModel.deleteMany();
  await TrendingResultModel.deleteMany();
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /trending - validation", () => {
  test("Should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post("/trending")
      .send({ timeRange: "1day" });

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });

  test("Should return 400 when timeRange is missing", async () => {
    const response = await postTrending(app, {}, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toMatch(/timeRange/i);
  });

  test("Should return 400 when timeRange is an invalid value", async () => {
    const response = await postTrending(
      app,
      { timeRange: "2weeks" },
      authCookies,
    );

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toMatch(/1day.*3days.*1week/i);
  });

  test.each<TrendingTimeRange>(["1day", "3days", "1week"])(
    "Should accept valid timeRange '%s'",
    async (timeRange) => {
      mockAIWithTopics();
      await seedPost("some post");

      const response = await postTrending(app, { timeRange }, authCookies);

      expect(response.statusCode).toEqual(StatusCodes.OK);
    },
  );
});

describe("POST /trending - fresh result generation", () => {
  test("Should return empty topics when there are no posts in range", async () => {
    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.topics).toEqual([]);
    expect(response.body.timeRange).toBe("1day");
    expect(mockGenerateAIContent).not.toHaveBeenCalled();
  });

  test("Should call AI and return generated topics when posts exist", async () => {
    mockAIWithTopics();
    await seedPost("AI is taking over the world");

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(mockGenerateAIContent).toHaveBeenCalledTimes(1);
    expect(response.body.topics).toHaveLength(MOCK_TOPICS.length);
    expect(response.body.topics[0].topicName).toBe(MOCK_TOPICS[0].topicName);
    expect(response.body.topics[0].shortSummary).toBe(
      MOCK_TOPICS[0].shortSummary,
    );
  });

  test("Should include the requested timeRange in the response", async () => {
    mockAIWithTopics();
    await seedPost("some post");

    const response = await postTrending(app, { timeRange: "3days" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.timeRange).toBe("3days");
  });

  test("Should include generatedAt in the response", async () => {
    mockAIWithTopics();
    await seedPost("some post");

    const before = Date.now();
    const response = await postTrending(app, { timeRange: "1day" }, authCookies);
    const after = Date.now();

    expect(response.statusCode).toEqual(StatusCodes.OK);
    const generatedAt = new Date(response.body.generatedAt).getTime();
    expect(generatedAt).toBeGreaterThanOrEqual(before);
    expect(generatedAt).toBeLessThanOrEqual(after);
  });

  test("Should save fresh result to the database", async () => {
    mockAIWithTopics();
    await seedPost("some post");

    await postTrending(app, { timeRange: "1day" }, authCookies);

    const saved = await TrendingResultModel.findOne({ timeRange: "1day" });
    expect(saved).not.toBeNull();
    expect(saved!.topics).toHaveLength(MOCK_TOPICS.length);
  });

  test("Should not save to DB when no posts exist (empty result)", async () => {
    await postTrending(app, { timeRange: "1day" }, authCookies);

    const saved = await TrendingResultModel.findOne({ timeRange: "1day" });
    expect(saved).toBeNull();
  });

  test("Should only consider posts within the time range", async () => {
    mockAIWithTopics();

    const oldDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await seedPost("old post", oldDate);

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.topics).toEqual([]);
    expect(mockGenerateAIContent).not.toHaveBeenCalled();

    const response3days = await postTrending(
      app,
      { timeRange: "3days" },
      authCookies,
    );
    expect(response3days.statusCode).toEqual(StatusCodes.OK);
    expect(mockGenerateAIContent).toHaveBeenCalledTimes(1);
  });
});

describe("POST /trending - cache behaviour", () => {
  test("Should return cached result when one exists within the last hour", async () => {
    await seedCachedResult("1day");

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(mockGenerateAIContent).not.toHaveBeenCalled();
    expect(response.body.topics).toHaveLength(MOCK_TOPICS.length);
    expect(response.body.timeRange).toBe("1day");
  });

  test("Should not use cache when cached result is older than 1 hour", async () => {
    mockAIWithTopics();
    await seedPost("fresh post");

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    await seedCachedResult("1day", twoHoursAgo);

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(mockGenerateAIContent).toHaveBeenCalledTimes(1);
  });

  test("Should not use cache of a different timeRange", async () => {
    mockAIWithTopics();
    await seedPost("some post");
    await seedCachedResult("3days"); 

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(mockGenerateAIContent).toHaveBeenCalledTimes(1);
  });

  test("Should save new result to DB after cache miss", async () => {
    mockAIWithTopics();
    await seedPost("some post");

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    await seedCachedResult("1day", twoHoursAgo);

    await postTrending(app, { timeRange: "1day" }, authCookies);

    const count = await TrendingResultModel.countDocuments({ timeRange: "1day" });
    expect(count).toBe(2);
  });
});

describe("POST /trending - AI error handling", () => {
  test("Should propagate error when AI service fails", async () => {
    mockAIFailure();
    await seedPost("some post");

    const response = await postTrending(app, { timeRange: "1day" }, authCookies);

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
