import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils";

export const moodSchema = z.enum([
  "Professional",
  "Sarcastic",
  "Poetic",
  "Gen-Z Slang",
]);
export type Mood = z.infer<typeof moodSchema>;

export const moodRequestSchema = z
  .object({
    postContent: notEmptyStringSchema("Post content"),
    mood: moodSchema,
  })
  .strict();
export type MoodRequest = z.infer<typeof moodRequestSchema>;
