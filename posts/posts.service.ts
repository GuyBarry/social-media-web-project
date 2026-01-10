import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { postRepository } from "./posts.repository";

export const getAllPosts = async (): Promise<Post[]> =>
  await postRepository.getAllPosts();

export const getPostById = async (id: Post["_id"]): Promise<Post | null> =>
  await postRepository.getPostById(id);

export const getPostsBySender = async (
  senderId: Post["sender"]
): Promise<Post[]> => await postRepository.getPostsBySender(senderId);

export const createPost = async (postData: CreatePost): Promise<Post> =>
  await postRepository.createPost(postData);

export const updatePost = async (
  id: Post["_id"],
  postData: UpdatePost
): Promise<Post | null> => await postRepository.updatePost(id, postData);

export const postService = {
  getAllPosts,
  getPostById,
  getPostsBySender,
  createPost,
  updatePost,
};
