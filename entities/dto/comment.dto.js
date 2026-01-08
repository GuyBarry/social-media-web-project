import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils.js";

export const commentSchema = z.strictObject({
  sender: notEmptyStringSchema("Sender "),
  message: notEmptyStringSchema("Message"),
  postId: notEmptyStringSchema("postId"),
});
