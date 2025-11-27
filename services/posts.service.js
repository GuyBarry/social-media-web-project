import postRepository from "../repositories/posts.repository";

const getAllPosts = () => postRepository.getAllPosts();

export default {
  getAllPosts
};