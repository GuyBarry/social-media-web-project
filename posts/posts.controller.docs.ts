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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
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
