import { CreatePost, Post, UpdatePost } from "../entities/dto/post.dto";
import { NotFoundException } from "../exceptions/notFoundException";
import { PaginationParams } from "../config/pagination.config";
import { postRepository } from "./posts.repository";
import { PaginateResult } from "mongoose";

export const getAllPosts = async (pagination: PaginationParams): Promise<PaginateResult<Post>> =>
  await postRepository.getAllPosts(pagination);

export const getPostById = async (id: Post["_id"]): Promise<Post> => {
  const post = await postRepository.getPostById(id);

  if (!post) {
    throw new NotFoundException("Post", { postId: id });
  }
  return post;
};

export const getPostsBySender = async (
  senderId: Post["sender"],
  pagination: PaginationParams,
): Promise<PaginateResult<Post>> => await postRepository.getPostsBySender(senderId, pagination);

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
