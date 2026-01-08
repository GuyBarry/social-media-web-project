import { postService } from "../posts/posts.service.js";
import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) =>
  await commentsRepository.getAllCommentsByPostId(postId);
const getCommentById = async (id) =>
  await commentsRepository.getCommentById(id);
const updateComment = async (id, commentData) =>
  await commentsRepository.updateComment(id, commentData);
const createComment = async (commentData) => {
  if (!(await postService.getPostById(commentData.postId))) {
    throw new Error("Post does not exist");
  }
  
  return await commentsRepository.createComment(commentData);
};
const deleteComment = async (id) => await commentsRepository.deleteComment(id);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  updateComment,
  createComment,
};
