import { z } from "zod";
import { VALID_TIME_RANGES } from "../../trending/trending.constants";

export const trendingTopicSchema = z.object({
  topicName: z.string(),
  shortSummary: z.string(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TrendingTopic:
 *       type: object
 *       properties:
 *         topicName:
 *           type: string
 *           example: Artificial Intelligence
 *         shortSummary:
 *           type: string
 *           example: Latest advancements in AI and machine learning technologies
 */
export type TrendingTopic = z.infer<typeof trendingTopicSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     TrendingResult:
 *       type: object
 *       properties:
 *         timeRange:
 *           type: string
 *           enum: [1day, 3days, 1week]
 *           example: 1day
 *         generatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-17T10:00:00.000Z"
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TrendingTopic'
 */
export const trendingResultSchema = z.object({
  topics: z.array(trendingTopicSchema),
  generatedAt: z.date(),
  timeRange: z.enum(VALID_TIME_RANGES as [string, ...string[]]),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     GetTrendingRequest:
 *       type: object
 *       required:
 *         - timeRange
 *       properties:
 *         timeRange:
 *           type: string
 *           enum: [1day, 3days, 1week]
 *           description: The time window to analyse posts for trending topics
 *           example: 1day
 */
export type TrendingResult = z.infer<typeof trendingResultSchema>;
