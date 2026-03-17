import { AICreativity, generateAIContent } from "../ai/ai.provider";
import { postService } from "../posts/posts.service";
import {
  trendingTopicSchema,
  TrendingResult,
} from "../entities/dto/trending.dto";
import { trendingRepository } from "./trending.repository";
import {
  TrendingTimeRange,
  VALID_TIME_RANGES,
  TIME_RANGE_MS,
} from "./trending.constants";
import { analyzeTrendingTopics } from "../ai/prompt.manager";

const getPostsInRange = async (
  timeRange: TrendingTimeRange,
): Promise<string[]> => {
  const since = new Date(Date.now() - TIME_RANGE_MS[timeRange]);
  return postService.getPostMessagesSinceDate(since);
};

const buildEmptyResult = (timeRange: TrendingTimeRange): TrendingResult => ({
  topics: [],
  generatedAt: new Date(),
  timeRange,
});

const findCachedResult = async (
  timeRange: TrendingTimeRange,
): Promise<TrendingResult | null> => {
  return trendingRepository.findRecentByTimeRange(timeRange);
};

const generateFreshResult = async (
  timeRange: TrendingTimeRange,
): Promise<TrendingResult> => {
  const posts = await getPostsInRange(timeRange);

  if (posts.length === 0) {
    return buildEmptyResult(timeRange);
  }

  const postsBlock = posts.map((msg, i) => `${i + 1}. ${msg}.`).join("\n");
  const topics = await analyzeTrendingTopics(postsBlock);

  return {
    topics,
    generatedAt: new Date(),
    timeRange,
  };
};

const saveTrendingResult = async (
  result: TrendingResult,
): Promise<TrendingResult> => {
  return trendingRepository.create(result);
};

const getTrending = async (timeRange: TrendingTimeRange): Promise<TrendingResult> => {
  const cached = await findCachedResult(timeRange);
  if (cached) {
    return cached;
  }

  const fresh = await generateFreshResult(timeRange);

  if (fresh.topics.length === 0) {
    return fresh;
  }

  return saveTrendingResult(fresh);
};

export const trendingService = {
  getTrending,
};