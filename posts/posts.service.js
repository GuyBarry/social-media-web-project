import postRepository from "./posts.repository.js";

const getAllPosts = async () => await postRepository.getAllPosts();

export default {
  getAllPosts
};