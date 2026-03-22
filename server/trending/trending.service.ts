import { postService } from "../posts/posts.service";
import { TrendingResult } from "../entities/dto/trending.dto";
import { trendingRepository } from "./trending.repository";
import { TrendingTimeRange, TIME_RANGE_MS } from "./trending.constants";
import { analyzeTrendingTopics } from "../ai/prompt.manager";

const getPostsSinceDate = async (
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

const generateNewResult = async (
  timeRange: TrendingTimeRange,
): Promise<TrendingResult> => {
  const posts = await getPostsSinceDate(timeRange);

  if (posts.length === 0) {
    return buildEmptyResult(timeRange);
  }

  const postsContentBlock = posts
    .map((msg, i) => `${i + 1}. ${msg}.`)
    .join("\n");
  const topics = await analyzeTrendingTopics(postsContentBlock);

  return {
    topics,
    generatedAt: new Date(),
    timeRange,
  };
};

const saveTrendingResult = async (
  result: TrendingResult,
): Promise<TrendingResult> => {
  return trendingRepository.saveTrendingResult(result);
};

const getTrending = async (
  timeRange: TrendingTimeRange,
): Promise<TrendingResult> => {
  const cachedResult = await findCachedResult(timeRange);
  if (cachedResult) {
    return cachedResult;
  }

  const newResult = await generateNewResult(timeRange);

  if (newResult.topics.length === 0) {
    return newResult;
  }

  return saveTrendingResult(newResult);
};

export const trendingService = {
  getTrending,
};
