import { z } from "zod";

export const createPostSchema = z.strictObject({
  sender: z.string().refine((sender) => {
    return sender.length > 0;
  }, "Sender must be a non-empty string"),
  message: z.string().refine((message) => {
    return message.length > 0;
  }, "Message must be a non-empty string"),
});
