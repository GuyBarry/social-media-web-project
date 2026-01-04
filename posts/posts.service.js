import { postRepository } from "./posts.repository.js";

const getAllPosts = async () => await postRepository.getAllPosts();
const getPostById = async (id) => await postRepository.getPostById(id);
const createPost = async (postData) =>
  await postRepository.createPost(postData);
const updatePost = async (id, postData) => 
  await postRepository.updatePost(id, postData);

export const postService = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
};
