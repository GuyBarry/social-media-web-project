import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) => await commentsRepository.getAllCommentsByPostId(postId);
const updateComment = async (id, commentData) => await commentsRepository.updateComment(id, commentData);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  updateComment,
};