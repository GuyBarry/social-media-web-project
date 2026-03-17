import { generateAIContent } from "../ai/ai.service";
import { postService } from "../posts/posts.service";

export type TrendingTimeRange = "1day" | "3days" | "1week";

export const VALID_TIME_RANGES: TrendingTimeRange[] = [
  "1day",
  "3days",
  "1week",
];

const TIME_RANGE_MS: Record<TrendingTimeRange, number> = {
  "1day": 24 * 60 * 60 * 1000,
  "3days": 3 * 24 * 60 * 60 * 1000,
  "1week": 7 * 24 * 60 * 60 * 1000,
};

const TIME_RANGE_LABEL: Record<TrendingTimeRange, string> = {
  "1day": "the last 1 day",
  "3days": "the last 3 days",
  "1week": "the last week",
};

const getPostsInRange = async (
  timeRange: TrendingTimeRange,
): Promise<string[]> => {
  const since = new Date(Date.now() - TIME_RANGE_MS[timeRange]);
  return await postService.getPostMessagesSinceDate(since);
};

const getTrending = async (timeRange: TrendingTimeRange): Promise<string> => {
  const posts = await getPostsInRange(timeRange);

  if (posts.length === 0) {
    return `No posts were found in ${TIME_RANGE_LABEL[timeRange]}. Nothing to summarize yet!`;
  }

  const postsBlock = posts.map((msg, i) => `${i + 1}. ${msg}`).join("\n");
  const prompt = `You are a social media analyst. Below are posts published on our platform in ${TIME_RANGE_LABEL[timeRange]}. Based only on these posts, summarize what is currently trending in 3-5 concise bullet points. Focus on recurring themes, popular topics, and notable content.

Posts:
${postsBlock}`;

  return generateAIContent(prompt);
};

export const trendingService = {
  getTrending,
};
