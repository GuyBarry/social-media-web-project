import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({}).exec();
const getPostById = async (id) => await Post.findById(id);
const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};

export const postRepository = {
  getAllPosts,
  getPostById,
  createPost,
};
