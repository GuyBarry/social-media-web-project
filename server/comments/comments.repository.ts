import { PaginateResult } from "mongoose";
import {
  Comment,
  CreateComment,
  UpdateComment,
} from "../entities/dto/comment.dto";
import { Post } from "../entities/dto/post.dto";
import { CommentModel } from "../entities/mongodb/comment.module";
import { USER_POPULATE_FIELDS } from "../entities/mongodb/user.module";
import { handleDuplicateKeyException } from "../exceptions/mongoException";
import { PAGINATE_SORT, PaginationParams } from "../config/pagination.config";

const POPULATE_OPTIONS = [
  { path: USER_POPULATE_FIELDS.field, select: USER_POPULATE_FIELDS.subFields },
];

const getAllComments = async (
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> => {
  const result = await CommentModel.paginate(
    {},
    { ...pagination, populate: POPULATE_OPTIONS, sort: PAGINATE_SORT },
  );
  return result;
};

const getAllCommentsByPostId = async (
  postId: Post["_id"],
  pagination: PaginationParams,
): Promise<PaginateResult<Comment>> => {
  const result = await CommentModel.paginate(
    { postId },
    { ...pagination, populate: POPULATE_OPTIONS, sort: PAGINATE_SORT },
  );
  return result;
};

const getCommentById = async (
  id: Comment["_id"]
): Promise<Comment | null> =>
  await CommentModel.findById(id)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();

const updateComment = async (
  id: Comment["_id"],
  commentData: UpdateComment
): Promise<Comment | null> =>
  await CommentModel.findByIdAndUpdate(id, commentData, { new: true }).exec();

const createComment = async (
  commentData: CreateComment
): Promise<Comment> => {
  const comment = new CommentModel(commentData);
  return await comment.save().catch((err) => handleDuplicateKeyException(err));
};

const deleteComment = async (id: Comment["_id"]): Promise<boolean> =>
  (await CommentModel.deleteOne({ _id: id }).exec()).deletedCount > 0;

const deleteCommentsByPostId = async (postId: Post["_id"]): Promise<void> => {
  await CommentModel.deleteMany({ postId }).exec();
};

export const commentsRepository = {
  getAllComments,
  getAllCommentsByPostId,
  deleteComment,
  getCommentById,
  createComment,
  updateComment,
  deleteCommentsByPostId,
};
