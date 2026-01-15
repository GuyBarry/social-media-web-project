import { z } from "zod";
import { notEmptyStringSchema } from "./zodUtils";

export const baseModule = z.object({
  _id: notEmptyStringSchema("Id"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BaseModule = z.infer<typeof baseModule>;
