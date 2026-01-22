import { z } from "zod";
import { baseModule } from "./base.dto";
import { notEmptyStringSchema } from "./zodUtils";

export const userSchema = baseModule.extend({
  username: notEmptyStringSchema("Username"),
  email: z.string().email().min(1),
  birthDate: z.string().date(),
  bio: z.string().optional(),
  password: notEmptyStringSchema("Password"),
});
export type User = z.infer<typeof userSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - birthDate
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         bio:
 *           type: string
 *         birthDate:
 *           type: string
 *         password:
 *           type: string
 */
export const createUserSchema = z.strictObject({
  _id: userSchema.shape._id.optional(),
  username: userSchema.shape.username,
  email: userSchema.shape.email,
  birthDate: userSchema.shape.birthDate,
  bio: userSchema.shape.bio,
  password: userSchema.shape.password,
});
export type CreateUser = z.infer<typeof createUserSchema>;

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         bio:
 *           type: string
 *         birthDate:
 *           type: string
 */
export const updateUserSchema = z
  .strictObject({
    username: userSchema.shape.username,
    email: userSchema.shape.email,
    birthDate: userSchema.shape.birthDate,
    bio: userSchema.shape.bio,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateUser = z.infer<typeof updateUserSchema>;
