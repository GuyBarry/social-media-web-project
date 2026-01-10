import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils";
import { baseModule } from "./base.dto";
import { postSchema } from "./post.dto";

export const commentSchema = baseModule
  .extend({
    sender: notEmptyStringSchema("Sender "),
    message: notEmptyStringSchema("Message"),
    postId: postSchema.shape._id,
  })
  .strict();

export type Comment = z.infer<typeof commentSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateComment:
 *       type: object
 *       required:
 *         - sender
 *         - message
 *         - postId
 *       properties:
 *         sender:
 *           type: string
 *           required: true
 *         message:
 *           type: string
 *           required: true
 *         postId:
 *           type: string
 *           required: true
 */
export const createCommentSchema = z
  .object({
    _id: commentSchema.shape._id.optional(),
    sender: commentSchema.shape.sender,
    message: commentSchema.shape.message,
    postId: commentSchema.shape.postId,
  })
  .strict();
export type CreateComment = z.infer<typeof createCommentSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateComment:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           required: true
 */
export const updateCommentSchema = z
  .object({
    message: commentSchema.shape.message,
  })
  .strict();
export type UpdateComment = z.infer<typeof updateCommentSchema>;