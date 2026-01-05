import { Comment } from "../entities/mongodb/comment.module.js";

const getAllComments = async () => await Comment.find({});
const getAllCommentsByPostId = async (postId) => await Comment.find({ postId });
const deleteComment = async (id) => (await Comment.deleteOne({ _id: id })).deletedCount > 0;

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
};
