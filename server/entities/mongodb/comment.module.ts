import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Comment } from "../dto/comment.dto";

const commentSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    postId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel = model<Comment>("Comment", commentSchema);
