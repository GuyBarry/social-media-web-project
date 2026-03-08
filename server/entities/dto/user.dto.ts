import { z } from "zod";
import { baseModule } from "./base.dto";
import { notEmptyStringSchema } from "./zodUtils";

export const bannerColorSchema = z
  .string()
  .refine((val) => /^[1-9]$/.test(val) || /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val), {
    message: "bannerColor must be a palette key (1–9) or a valid hex color",
  });

export const userSchema = baseModule.extend({
  username: notEmptyStringSchema("Username"),
  email: z.string().email().min(1),
  birthDate: z.string().date().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  password: z.string(),
  googleId: z.string().optional(),
  bannerColor: bannerColorSchema.optional(),
});
export type User = z.infer<typeof userSchema>;
export type UserPreview = Omit<User, "password" | "googleId"> & {
  postsCount?: number;
  likesCount?: number;
};

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
  password: z.string(),
});
const createGoogleUserSchema = createUserSchema
  .omit({ password: true })
  .extend({
    googleId: z.string(),
  });

export type CreateUser = z.infer<typeof createUserSchema>;
export type CreateGoogleUser = z.infer<typeof createGoogleUserSchema>;

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
 *         imageUrl:
 *           type: string
 *           description: URL of the user's profile picture (set automatically from uploaded file)
 *         birthDate:
 *           type: string
 *         bannerColor:
 *           type: string
 *           description: Palette key ("1"–"9") or a hex color code (e.g. "#ff0000")
 */
export const updateUserSchema = z
  .strictObject({
    username: userSchema.shape.username,
    email: userSchema.shape.email,
    birthDate: userSchema.shape.birthDate,
    bio: userSchema.shape.bio,
    imageUrl: userSchema.shape.imageUrl,
    bannerColor: userSchema.shape.bannerColor,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateUser = z.infer<typeof updateUserSchema>;
