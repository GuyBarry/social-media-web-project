/**
 * @openapi
 * /posts/:
 *   get:
 *     tags:
 *      - Posts
 *     summary: Get all posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         description: Optional sender id to filter posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   sender:
 *                     type: string
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of user IDs who liked this post
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
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

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     tags:
 *      - Posts
 *     summary: Get post by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The requested post id
 *     responses:
 *       200:
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                  type: string
 *                message:
 *                  type: string
 *                sender:
 *                  type: string
 *                likes:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: Array of user IDs who liked this post
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post does not exist
 */

/**
 * @openapi
 * /posts/:
 *   post:
 *     tags:
 *      - Posts
 *     summary: Create new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - message
 *               - picture
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The id of the post sender
 *               message:
 *                 type: string
 *                 description: The post message content
 *               picture:
 *                 type: string
 *                 format: binary
 *                 description: The post picture file (jpeg, png, gif, webp — max 5MB)
 *     responses:
 *       201:
 *         description: Returns the created post id
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Created new post
 *                postId:
 *                  type: string
 *                  example: 1234
 *                createdAt:
 *                  type: string
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
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post already exists
 *                 details:
 *                   type: object
 *                   properties:
 *                     field: 
 *                       type: string
 *                     value: 
 *                       type: string
 */

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     tags:
 *      - Posts
 *     summary: Update post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The updated post message content
 *               picture:
 *                 type: string
 *                 format: binary
 *                 description: The updated post picture file (jpeg, png, gif, webp — max 5MB)
 *           description: At least one of message or picture must be provided
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Updated post
 *                postId:
 *                  type: string
 *                  example: 1234
 *                updatedAt:
 *                  type: string
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
 *       404:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post does not exist
 */

/**
 * @openapi
 * /posts/{id}/like:
 *   patch:
 *     tags:
 *      - Posts
 *     summary: Like or dislike a post
 *     description: >
 *       Like or dislike the specified post based on the `method` field.
 *       Liking a post you already liked returns 409 Conflict.
 *       Disliking a post you have not liked returns 404 Not Found.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post to like or dislike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeRequest'
 *     responses:
 *       200:
 *         description: Like action processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post liked
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
 *       404:
 *         description: Post or Like not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post does not exist
 *       409:
 *         description: Already liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Like already exists
 */
