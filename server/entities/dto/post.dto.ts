import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils";
import { baseModule } from "./base.dto";
import { userSchema } from "./user.dto";

export const postSchema = baseModule
  .extend({
    sender: notEmptyStringSchema("Sender"),
    message: notEmptyStringSchema("Message"),
    picture: notEmptyStringSchema("Picture"),
    likes: z.array(userSchema.shape._id),
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
    picture: postSchema.shape.picture.optional(),
  })
  .strict();
export type CreatePost = z.infer<typeof createPostSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePost:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         picture:
 *           type: string
 */
export const updatePostSchema = z
  .object({
    message: postSchema.shape.message.optional(),
    picture: postSchema.shape.picture.optional(),
  })
  .strict()
  .refine((data) => data.message !== undefined || data.picture !== undefined, {
    message: "At least one of 'message' or 'picture' must be provided",
  });
export type UpdatePost = z.infer<typeof updatePostSchema>;
