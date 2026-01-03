import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({}).exec();
const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};

export default {
  getAllPosts,
  createPost,
};
