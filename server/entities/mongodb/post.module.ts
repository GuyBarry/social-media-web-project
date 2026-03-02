import { model, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Post } from "../dto/post.dto";

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    message: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
});

export const PostModel = model<Post>("Post", postSchema);
