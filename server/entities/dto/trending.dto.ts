import { z } from "zod";
import { VALID_TIME_RANGES } from "../../trending/trending.constants";

export const trendingTopicSchema = z.object({
  topicName: z.string(),
  shortSummary: z.string(),
});

export const trendingResultSchema = z.object({
  topics: z.array(trendingTopicSchema),
  generatedAt: z.date(),
  timeRange: z.enum(VALID_TIME_RANGES as [string, ...string[]]),
});

export type TrendingTopic = z.infer<typeof trendingTopicSchema>;
export type TrendingResult = z.infer<typeof trendingResultSchema>;
