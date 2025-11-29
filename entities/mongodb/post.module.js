import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";

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
    sender: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = model("Post", postSchema);