import { z } from "zod";

export const notEmptyStringSchema = (fieldName) =>
  z.string().refine((value) => {
    return value.length > 0;
  }, `${fieldName} must be a non-empty string`);
