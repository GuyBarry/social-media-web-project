import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({});
const getPostById = async (id) => await Post.findById(id);

export const postRepository = {
  getAllPosts,
  getPostById
};