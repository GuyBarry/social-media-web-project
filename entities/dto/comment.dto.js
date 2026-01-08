import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils.js";

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
export const createCommentSchema = z.strictObject({
  sender: notEmptyStringSchema("Sender "),
  message: notEmptyStringSchema("Message"),
  postId: notEmptyStringSchema("postId"),
});

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
export const updateCommentSchema = z.strictObject({
  message: createCommentSchema.shape.message,
});
