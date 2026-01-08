import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils.js";

export const createCommentSchema = z.strictObject({
  sender: notEmptyStringSchema("Sender "),
  message: notEmptyStringSchema("Message"),
  postId: notEmptyStringSchema("postId"),
});

export const updateCommentSchema = z.strictObject({
  message: createCommentSchema.shape.message,
});
