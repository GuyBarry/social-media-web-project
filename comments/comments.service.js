import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) => await commentsRepository.getAllCommentsByPostId(postId);
const getCommentById = async (id) => await commentsRepository.getCommentById(id);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  getCommentById,
};