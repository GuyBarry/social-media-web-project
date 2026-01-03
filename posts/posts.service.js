import { postRepository } from "./posts.repository.js";

const getAllPosts = async () => await postRepository.getAllPosts();

const getPostById = async (id) => await postRepository.getPostById(id);

export const postService = {
  getAllPosts,
  getPostById,
};
