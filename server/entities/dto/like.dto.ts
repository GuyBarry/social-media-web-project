import { z } from "zod";
import { baseModule } from "./base.dto";
import { postSchema } from "./post.dto";
import { userSchema } from "./user.dto";

export const likeSchema = baseModule
  .extend({
    userId: userSchema.shape._id,
    postId: postSchema.shape._id,
  })
  .strict();

export type Like = z.infer<typeof likeSchema>;

export const likeMethodSchema = z.enum(["like", "dislike"]);
export type LikeMethod = z.infer<typeof likeMethodSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     LikeRequest:
 *       type: object
 *       required:
 *         - method
 *       properties:
 *         method:
 *           type: string
 *           enum: [like, dislike]
 */

export const likeRequestSchema = z
  .object({
    method: likeMethodSchema,
  })
  .strict();
export type LikeRequest = z.infer<typeof likeRequestSchema>;
