import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils.js";

export const createPostSchema = z.strictObject({
  sender: notEmptyStringSchema("Sender"),
  message: notEmptyStringSchema("Message"),
});
