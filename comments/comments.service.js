import { commentsRepository } from "./comments.repository.js";

const getAllComments = () => commentsRepository.getAllComments();
const getAllCommentsByPostId = (postId) => commentsRepository.getAllCommentsByPostId(postId);

export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
};