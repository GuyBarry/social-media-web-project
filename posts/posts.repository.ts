import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { PostModel } from "../entities/mongodb/post.module";
import { CustomException } from "../exceptions/customException";
import { handleDuplicateKeyException } from "../exceptions/mongoException";

export const getAllPosts = async (): Promise<Post[]> =>
  await PostModel.find({}).exec();

export const getPostById = async (id: Post["_id"]): Promise<Post | null> =>
  await PostModel.findById(id).exec();

export const getPostsBySender = async (
  sender: Post["sender"]
): Promise<Post[]> => await PostModel.find({ sender }).exec();

export const createPost = async (postData: CreatePost): Promise<Post> => {
  const post = new PostModel(postData);
  return await post.save().catch((err) => handleDuplicateKeyException(err));
};

export const updatePost = async (
  id: Post["_id"],
  postData: UpdatePost
): Promise<Post | null> =>
  await PostModel.findByIdAndUpdate(id, postData, { new: true }).exec();

export const postRepository = {
  getAllPosts,
  getPostById,
  getPostsBySender,
  createPost,
  updatePost,
};
