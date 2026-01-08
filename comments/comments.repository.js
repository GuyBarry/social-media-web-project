import { Comment } from "../entities/mongodb/comment.module.js";

const getAllComments = async () => await Comment.find({});
const getAllCommentsByPostId = async (postId) => await Comment.find({ postId });
const getCommentById = async (id) => await Comment.findById(id);
const updateComment = async (id, commentData) =>
  await Comment.findByIdAndUpdate(id, commentData, { new: true });
const createComment = async (commentData) => {
  const comment = new Comment(commentData);
  return await comment.save();
};

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
};
