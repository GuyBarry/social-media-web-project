/**
 * @openapi
 * /ai/mood:
 *   post:
 *     tags:
 *       - AI
 *     summary: Rewrite post content with a given mood
 *     description: >
 *       Uses an AI model to rewrite the provided post content in the specified mood style.
 *       Supported moods are: Professional, Sarcastic, Poetic, Gen-Z Slang.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postContent
 *               - mood
 *             properties:
 *               postContent:
 *                 type: string
 *                 description: The original post content to be rewritten
 *                 example: Just had a great day at the park!
 *               mood:
 *                 type: string
 *                 enum:
 *                   - Professional
 *                   - Sarcastic
 *                   - Poetic
 *                   - Gen-Z Slang
 *                 description: The mood style to apply to the post content
 *                 example: Poetic
 *     responses:
 *       200:
 *         description: Successfully rewritten post content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: The AI-rewritten post content
 *                   example: Beneath the golden canopy of swaying boughs, the day unfolded its splendor.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
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
