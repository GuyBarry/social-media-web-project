import postRepository from "../repositories/posts.repository.js";

const getAllPosts = () => postRepository.getAllPosts();

export default {
  getAllPosts
};