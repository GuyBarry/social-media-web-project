import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { COMMENTS_POPULATE_FIELD } from "../entities/mongodb/comment.module";
import { LIKES_POPULATE_FIELD } from "../entities/mongodb/like.module";
import { PostModel } from "../entities/mongodb/post.module";
import { USER_POPULATE_FIELDS } from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";

type PopulatedLike = { userId: string };

const extractLikeUserIds = (post: any): Post => {
  const obj = post.toObject({ virtuals: true });
  return {
    ...obj,
    likes: ((obj.likes as PopulatedLike[]) ?? []).map((like) => like.userId),
  };
};

export const getAllPosts = async (): Promise<Post[]> => {
  const posts = await PostModel.find({})
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .populate(LIKES_POPULATE_FIELD)
    .populate(COMMENTS_POPULATE_FIELD)
    .exec();
  return posts.map(extractLikeUserIds);
};

export const getPostById = async (id: Post["_id"]): Promise<Post | null> => {
  const post = await PostModel.findById(id)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .populate(LIKES_POPULATE_FIELD)
    .populate(COMMENTS_POPULATE_FIELD)
    .exec();
  return post ? extractLikeUserIds(post) : null;
};

export const getPostsBySender = async (
  sender: Post["sender"],
): Promise<Post[]> => {
  const posts = await PostModel.find({ sender })
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .populate(LIKES_POPULATE_FIELD)
    .populate(COMMENTS_POPULATE_FIELD)
    .exec();
  return posts.map(extractLikeUserIds);
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

export const postRepository = {
  getAllPosts,
  getPostById,
  getPostsBySender,
  createPost,
  updatePost,
};
