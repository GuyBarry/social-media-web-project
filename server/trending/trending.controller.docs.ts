/**
 * @openapi
 * /trending/:
 *   post:
 *     tags:
 *       - Trending
 *     summary: Get trending topics
 *     description: >
 *       Returns the top 3 trending topics derived from posts within the given
 *       time range. Results are cached for 1 hour — if a result for the same
 *       time range was already generated within the last hour, that cached
 *       result is returned instead of calling the AI again.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetTrendingRequest'
 *     responses:
 *       200:
 *         description: Trending topics result (fresh or cached)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrendingResult'
 *             examples:
 *               withTopics:
 *                 summary: Result with topics
 *                 value:
 *                   timeRange: 1day
 *                   generatedAt: "2026-03-17T10:00:00.000Z"
 *                   topics:
 *                     - topicName: Artificial Intelligence
 *                       shortSummary: Latest advancements in AI and machine learning
 *                     - topicName: Web Development
 *                       shortSummary: New frameworks and best practices
 *                     - topicName: Cloud Computing
 *                       shortSummary: Emerging trends in cloud infrastructure
 *               noTopics:
 *                 summary: No posts in the selected time range
 *                 value:
 *                   timeRange: 1week
 *                   generatedAt: "2026-03-17T10:00:00.000Z"
 *                   topics: []
 *       400:
 *         description: Bad request — invalid or missing timeRange
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Field 'timeRange' must be one of: 1day, 3days, 1week."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is unauthorized
 */
