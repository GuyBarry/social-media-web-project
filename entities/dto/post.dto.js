import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePost:
 *       type: object
 *       required:
 *         - sender
 *         - message
 *       properties:
 *         sender:
 *           type: string
 *           required: true
 *         message:
 *           type: string
 *           required: true
 */
export const createPostSchema = z.strictObject({
  sender: notEmptyStringSchema("Sender"),
  message: notEmptyStringSchema("Message"),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePost:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           required: true
 */
export const updatePostSchema = z.strictObject({
  message: createPostSchema.shape.message,
});
