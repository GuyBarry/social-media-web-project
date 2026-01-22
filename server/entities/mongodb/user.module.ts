import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { User } from "../dto/user.dto";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    birthDate: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const USER_POPULATE_FIELDS = {
  field: "sender",
  subFields: ["username"],
} as const;

export const USER_FIELDS_EXCEPT_PASSWORD = ["-password"];

export const UserModel = model<User>("User", userSchema);
