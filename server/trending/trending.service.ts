import { generateAIContent } from "../ai/ai.service";
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

const getPostsInRange = async (
  timeRange: TrendingTimeRange,
): Promise<string[]> => {
  const since = new Date(Date.now() - TIME_RANGE_MS[timeRange]);
  return postService.getPostMessagesSinceDate(since);
};

const buildPrompt = (posts: string[]): string => {
  const postsBlock = posts.map((msg, i) => `${i + 1}. ${msg}.`).join("\n");
  return `
        You are a trend-analysis engine for a social media platform.
        Analyze the following list of posts and identify the top 3 trending topics.
        
        Posts to analyze:
        - ${postsBlock}
        
        Rules:
        1. Return ONLY a valid JSON array of objects.
        2. Each object must have a "topicName" (string) and a "shortSummary" (string).
        3. Do not include markdown formatting like \`\`\`json.
    `;
};

const callAI = async (prompt: string): Promise<TrendingResult["topics"]> => {
  const raw = await generateAIContent(prompt);
  const parsed = JSON.parse(raw.trim());
  return trendingTopicSchema.array().parse(parsed);
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

  const prompt = buildPrompt(posts);
  const topics = await callAI(prompt);

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