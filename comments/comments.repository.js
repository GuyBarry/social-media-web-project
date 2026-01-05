import { Comment } from "../entities/mongodb/comment.module.js";

const getAllComments = async () => await Comment.find({});
const getAllCommentsByPostId = async (postId) => await Comment.find({ postId });
const getCommentById = async (id) => await Comment.findById(id);

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  getCommentById,
};
