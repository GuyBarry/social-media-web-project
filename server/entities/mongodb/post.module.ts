import { model, Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidV4 } from "uuid";
import { Post } from "../dto/post.dto";
import { Like } from "../dto/like.dto";

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
  },
);

postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
});

postSchema.virtual("numComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

postSchema.plugin(mongoosePaginate);

export const PostModel = model<Post>("Post", postSchema) as PaginateModel<Post>;

export type PopulatedLike = Pick<Like, "userId">;
