import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) => await commentsRepository.getAllCommentsByPostId(postId);
const deleteComment = async (id) => await commentsRepository.deleteComment(id);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
};