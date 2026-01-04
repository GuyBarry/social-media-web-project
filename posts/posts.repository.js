import { Post } from "../entities/mongodb/post.module.js";

const getAllPosts = async () => await Post.find({});
const getPostById = async (id) => await Post.findById(id);
const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};

const updatePost = async (id, postData) => {
  const result = await Post.findByIdAndUpdate(id, postData, {
    new: true,
    includeResultMetadata: true,
  });

  return result.value
    ? { _id: result.value._id, updatedAt: result.value.updatedAt }
    : { _id: null, updatedAt: null };
};

export const postRepository = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
};
