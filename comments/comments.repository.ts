import {
  Comment,
  CreateComment,
  UpdateComment,
} from "../entities/dto/comment.dto";
import { Post } from "../entities/dto/post.dto";
import { CommentModel } from "../entities/mongodb/comment.module";

export const getAllComments = async (): Promise<Comment[]> =>
  await CommentModel.find({}).exec();

export const getAllCommentsByPostId = async (
  postId: Post["_id"]
): Promise<Comment[]> => await CommentModel.find({ postId }).exec();

export const getCommentById = async (
  id: Comment["_id"]
): Promise<Comment | null> => await CommentModel.findById(id).exec();

export const updateComment = async (
  id: Comment["_id"],
  commentData: UpdateComment
): Promise<Comment | null> =>
  await CommentModel.findByIdAndUpdate(id, commentData, { new: true }).exec();

export const createComment = async (
  commentData: CreateComment
): Promise<Comment> => {
  const comment = new CommentModel(commentData);
  return await comment.save();
};

export const deleteComment = async (id: Comment["_id"]): Promise<boolean> =>
  (await CommentModel.deleteOne({ _id: id }).exec()).deletedCount > 0;

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  createComment,
  updateComment,
};
