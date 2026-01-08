import { Comment } from "../entities/mongodb/comment.module.js";

const getAllComments = async () => await Comment.find({});
const getAllCommentsByPostId = async (postId) => await Comment.find({ postId });
const updateComment = async (id, commentData) => await Comment.findByIdAndUpdate(id, commentData, { new: true });

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  updateComment,
};
