import postRepository from "./posts.repository.js";

const getAllPosts = async () => await postRepository.getAllPosts();
const createPost = async (postData) => await postRepository.createPost(postData);

export default {
  getAllPosts,
  createPost,
};
