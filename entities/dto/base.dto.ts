import { z } from "zod";

export const baseModule = z.object({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BaseModule = z.infer<typeof baseModule>;
