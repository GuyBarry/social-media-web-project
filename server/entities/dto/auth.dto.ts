import { z } from "zod";
import { userSchema } from "./user.dto";

export const loginSchema = z
  .object({
    password: userSchema.shape.password,
    email: userSchema.shape.email.optional(),
    username: userSchema.shape.username.optional(),
  })
  .refine(
    ({ email, username }) => username !== undefined || email !== undefined,
    {
      message: "User login identification missing, provide email or username",
    }
  );
export type Login = z.infer<typeof loginSchema>;

export enum ExpirationInSec {
  ONE_MINUTE = 60,
  ONE_HOUR = ONE_MINUTE * 60,
  ONE_DAY = ONE_HOUR * 24,
}
export const ExpirationInSecSchema = z.enum(ExpirationInSec);

export const LoginTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.object({
    token: z.string(),
    cookieExpiry: ExpirationInSecSchema,
  }),
});
export type LoginTokens = z.infer<typeof LoginTokensSchema>;
