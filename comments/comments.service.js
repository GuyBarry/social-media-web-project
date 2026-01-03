import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) => await commentsRepository.getAllCommentsByPostId(postId);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
};