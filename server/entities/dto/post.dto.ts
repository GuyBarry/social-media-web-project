import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils";
import { baseModule } from "./base.dto";

export const postSchema = baseModule
  .extend({
    sender: notEmptyStringSchema("Sender"),
    message: notEmptyStringSchema("Message"),
  })
  .strict();
export type Post = z.infer<typeof postSchema>;

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
export const createPostSchema = z
  .object({
    _id: postSchema.shape._id.optional(),
    sender: postSchema.shape.sender,
    message: postSchema.shape.message,
  })
  .strict();
export type CreatePost = z.infer<typeof createPostSchema>;

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
export const updatePostSchema = z
  .object({
    message: postSchema.shape.message,
  })
  .strict();
export type UpdatePost = z.infer<typeof updatePostSchema>;
