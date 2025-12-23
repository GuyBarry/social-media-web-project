import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({}).exec();

export default {
  getAllPosts,
};