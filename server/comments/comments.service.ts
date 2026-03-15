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

const getAllComments = async (
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> =>
  await commentsRepository.getAllComments(pagination);

const getAllCommentsByPostId = async (
  postId: Post["_id"],
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> => {
  if (!(await postService.getPostById(postId))) {
    throw new NotFoundException("Post", { postId });
  }

  return await commentsRepository.getAllCommentsByPostId(postId, pagination);
};
const getCommentById = async (id: Comment["_id"]): Promise<Comment> => {
  const comment = await commentsRepository.getCommentById(id);

  if (!comment) {
    throw new NotFoundException("Comment", { commentId: id });
  }
  return comment;
};

const updateComment = async (
  id: Comment["_id"],
  commentData: UpdateComment
): Promise<Comment> => {
  const comment = await commentsRepository.updateComment(id, commentData);
  if (!comment) {
    throw new NotFoundException("Comment", { commentId: id });
  }
  return comment;
};

const createComment = async (
  commentData: CreateComment
): Promise<Comment> => {
  if (!(await postService.getPostById(commentData.postId))) {
    const postId = commentData.postId;
    throw new NotFoundException("Post", { postId });
  }

  return await commentsRepository.createComment(commentData);
};

const deleteComment = async (id: Comment["_id"]): Promise<void> => {
  const isDeleted = await commentsRepository.deleteComment(id);
  
  if (!isDeleted) {
    throw new NotFoundException("Comment", { commentId: id });
  }
};

const deleteCommentsByPostId = async (postId: Post["_id"]): Promise<void> => {
  await commentsRepository.deleteCommentsByPostId(postId);
}

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  updateComment,
  createComment,
  deleteCommentsByPostId,
};
