import { z } from "zod";

export const updateCommentSchema = z.strictObject({
  message: z
    .string()
    .refine((message) => message.length > 0, "Message must be a non-empty string"),
});
