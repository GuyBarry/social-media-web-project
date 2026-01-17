import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { NotFoundException } from "../exceptions/notFoundException";
import { postRepository } from "./posts.repository";

export const getAllPosts = async (): Promise<Post[]> =>
  await postRepository.getAllPosts();

export const getPostById = async (id: Post["_id"]): Promise<Post | null> => {
  const post = await postRepository.getPostById(id);

  if (!post) {
    throw new NotFoundException("Post", { postId: id });
  }
  return post;
};

export const getPostsBySender = async (
  senderId: Post["sender"]
): Promise<Post[]> => await postRepository.getPostsBySender(senderId);

export const createPost = async (postData: CreatePost): Promise<Post> =>
  await postRepository.createPost(postData);

export const updatePost = async (
  id: Post["_id"],
  postData: UpdatePost
): Promise<Post> => {
  const post = await postRepository.updatePost(id, postData);

  if (!post) {
    throw new NotFoundException("Post", { postId: id });
  }
  return post;
};

export const postService = {
  getAllPosts,
  getPostById,
  getPostsBySender,
  createPost,
  updatePost,
};
