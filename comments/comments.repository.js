import { Comment } from "../entities/mongodb/comment.module.js";

const getAllComments = async () => await Comment.find({});
const getAllCommentsByPostId = async (postId) => await Comment.find({ postId });

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
};
