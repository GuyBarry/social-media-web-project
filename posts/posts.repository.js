import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({});
const getPostById = async (id) => await Post.findById(id);
const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};
const getPostsBySender = async (sender) => await Post.find({ sender });
const updatePost = async (id, postData) =>
  await Post.findByIdAndUpdate(id, postData, { new: true });

export const postRepository = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  getPostsBySender,
};
