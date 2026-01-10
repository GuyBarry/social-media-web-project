import { postService } from "../posts/posts.service";
import { commentsRepository } from "./comments.repository";
import {
  Comment,
  CreateComment,
  UpdateComment,
} from "../entities/dto/comment.dto";
import { Post } from "../entities/dto/post.dto";

export const getAllComments = async (): Promise<Comment[]> =>
  await commentsRepository.getAllComments();

export const getAllCommentsByPostId = async (
  postId: Post["_id"]
): Promise<Comment[]> => {
  if (!(await postService.getPostById(postId))) {
    throw new Error("Post does not exist");
  }

  return await commentsRepository.getAllCommentsByPostId(postId);
};
export const getCommentById = async (
  id: Comment["_id"]
): Promise<Comment | null> => await commentsRepository.getCommentById(id);

export const updateComment = async (
  id: Comment["_id"],
  commentData: UpdateComment
): Promise<Comment | null> =>
  await commentsRepository.updateComment(id, commentData);

export const createComment = async (
  commentData: CreateComment
): Promise<Comment> => {
  if (!(await postService.getPostById(commentData.postId))) {
    throw new Error("Post does not exist");
  }

  return await commentsRepository.createComment(commentData);
};

export const deleteComment = async (id: Comment["_id"]): Promise<boolean> =>
  await commentsRepository.deleteComment(id);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  updateComment,
  createComment,
};
