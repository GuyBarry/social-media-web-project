import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { COMMENTS_POPULATE_FIELD } from "../entities/mongodb/comment.module";
import { LIKES_POPULATE_FIELD } from "../entities/mongodb/like.module";
import { PopulatedLike, PostModel } from "../entities/mongodb/post.module";
import { USER_POPULATE_FIELDS, USER_STATS_POPULATE } from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";
import { PaginateResult, PopulateOptions } from "mongoose";
import { PAGINATE_SORT, PaginationParams } from "../config/pagination.config";


const POPULATE_OPTIONS: PopulateOptions[] = [
  {
    path: USER_POPULATE_FIELDS.field,
    select: USER_POPULATE_FIELDS.subFields,
    populate: USER_STATS_POPULATE,
  },
  LIKES_POPULATE_FIELD,
  COMMENTS_POPULATE_FIELD,
];

const convertToPost = (post: any): Post => {
  const obj = post.toObject({ virtuals: true });
  return {
    ...obj,
    likes: ((obj.likes as PopulatedLike[]) ?? []).map((like) => like.userId),
  };
};

export const getAllPosts = async (
  pagination: PaginationParams,
): Promise<PaginateResult<Post>> => {
  const result = await PostModel.paginate(
    {},
    { ...pagination, populate: POPULATE_OPTIONS, sort: PAGINATE_SORT },
  );
  return { ...result, docs: result.docs.map(convertToPost) };
};

export const getPostById = async (id: Post["_id"]): Promise<Post | null> => {
  const post = await PostModel.findById(id)
    .populate({
      path: USER_POPULATE_FIELDS.field,
      select: USER_POPULATE_FIELDS.subFields,
      populate: USER_STATS_POPULATE,
    })
    .populate(LIKES_POPULATE_FIELD)
    .populate(COMMENTS_POPULATE_FIELD)
    .exec();
  return post ? convertToPost(post) : null;
};

export const getPostsBySender = async (
  sender: Post["sender"],
  pagination: PaginationParams,
): Promise<PaginateResult<Post>> => {
  const result = await PostModel.paginate(
    { sender },
    { ...pagination, populate: POPULATE_OPTIONS, sort: PAGINATE_SORT },
  );
  return { ...result, docs: result.docs.map(convertToPost) };
};

export const createPost = async (postData: CreatePost): Promise<Post> => {
  const post = new PostModel(postData);
  return await post.save().catch((err) => handleDuplicateKeyException(err));
};

export const updatePost = async (
  id: Post["_id"],
  postData: UpdatePost,
): Promise<Post | null> =>
  await PostModel.findByIdAndUpdate(id, postData, { new: true }).exec();

export const deletePost = async (id: Post["_id"]): Promise<Post | null> =>
  await PostModel.findByIdAndDelete(id).exec();

export const postRepository = {
  getAllPosts,
  getPostById,
  getPostsBySender,
  createPost,
  updatePost,
  deletePost,
};
