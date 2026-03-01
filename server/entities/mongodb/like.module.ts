import { model, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Like } from "../dto/like.dto";

const likeSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    postId: {
      type: String,
      ref: "Post",
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const LIKES_POPULATE_FIELD = {
  path: "likes",
  select: "userId -_id",
};

export const LikeModel = model<Like>("Like", likeSchema);
