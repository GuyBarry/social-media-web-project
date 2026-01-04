import { postService } from "../posts/posts.service.js";
import { commentsRepository } from "./comments.repository.js";

const getAllComments = async () => await commentsRepository.getAllComments();
const getAllCommentsByPostId = async (postId) =>
  await commentsRepository.getAllCommentsByPostId(postId);
const createComment = async (commentData) => {
  if (!(await postService.getPostById(commentData.postId))) {
    return { _id: null, createdAt: null };
  }

  return await commentsRepository.createComment(commentData);
};
export const commentsService = {
  getAllComments,
  getAllCommentsByPostId,
  createComment,
};
