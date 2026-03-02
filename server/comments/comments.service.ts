import { PaginateResult } from "mongoose";
import { PaginationParams } from "../config/pagination.config";
import { postService } from "../posts/posts.service";
import { commentsRepository } from "./comments.repository";
import {
  Comment,
  CreateComment,
  UpdateComment,
} from "../entities/dto/comment.dto";
import { Post } from "../entities/dto/post.dto";
import { NotFoundException } from "../exceptions/notFoundException";

export const getAllComments = async (
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> =>
  await commentsRepository.getAllComments(pagination);

export const getAllCommentsByPostId = async (
  postId: Post["_id"],
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> => {
  if (!(await postService.getPostById(postId))) {
    throw new NotFoundException("Post", { postId });
  }

  return await commentsRepository.getAllCommentsByPostId(postId, pagination);
};
export const getCommentById = async (id: Comment["_id"]): Promise<Comment> => {
  const comment = await commentsRepository.getCommentById(id);

  if (!comment) {
    throw new NotFoundException("Comment", { commentId: id });
  }
  return comment;
};

export const updateComment = async (
  id: Comment["_id"],
  commentData: UpdateComment
): Promise<Comment> => {
  const comment = await commentsRepository.updateComment(id, commentData);
  if (!comment) {
    throw new NotFoundException("Comment", { commentId: id });
  }
  return comment;
};

export const createComment = async (
  commentData: CreateComment
): Promise<Comment> => {
  if (!(await postService.getPostById(commentData.postId))) {
    const postId = commentData.postId;
    throw new NotFoundException("Post", { postId });
  }

  return await commentsRepository.createComment(commentData);
};

export const deleteComment = async (id: Comment["_id"]): Promise<void> => {
  const isDeleted = await commentsRepository.deleteComment(id);
  
  if (!isDeleted) {
    throw new NotFoundException("Comment", { commentId: id });
  }
};

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  updateComment,
  createComment,
};
