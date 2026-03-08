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
    imageUrl: {
      type: String,
      default: "",
    },
    birthDate: {
      type: Date,
    },
    password: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    bannerColor: {
      type: String,
      default: "1",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("postsCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "sender",
  count: true,
});

userSchema.virtual("likesCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "sender",
  pipeline: [
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "postLikes",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $size: "$postLikes" } },
      },
    },
  ],
});

export const USER_POPULATE_FIELDS = {
  field: "sender",
  subFields: ["username", "imageUrl"],
} as const;

export const USER_STATS_POPULATE = { path: "postsCount" };

export const USER_FIELDS_EXCEPT_AUTH = ["-password", "-googleId"] as const;

export const UserModel = model<User>("User", userSchema);
