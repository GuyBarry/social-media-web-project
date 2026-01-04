import { z } from "zod";

export const commentSchema = z.strictObject({
  sender: z.string().refine((sender) => {
    return sender.length > 0;
  }, "Sender must be a non-empty string"),
  message: z.string().refine((message) => {
    return message.length > 0;
  }, "Message must be a non-empty string"),
  postId: z.string().refine((postId) => {
    return postId.length > 0;
  }, "postId must be a non-empty string"),
});
