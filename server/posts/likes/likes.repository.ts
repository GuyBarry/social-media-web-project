import { Post } from "../../entities/dto/post.dto";
import { LikeModel } from "../../entities/mongodb/like.module";
import { handleDuplicateKeyException } from "../../exceptions/mongoException";

const likePost = async (postId: string, userId: string): Promise<void> => {
  const like = new LikeModel({ postId, userId });
  await like.save().catch(handleDuplicateKeyException);
};

const dislikePost = async (
  postId: string,
  userId: string,
): Promise<boolean> => {
  const result = await LikeModel.deleteOne({ postId, userId }).exec();
  return result.deletedCount > 0;
};

const deleteLikesByPostId = async (postId: Post["_id"]): Promise<void> => {
  await LikeModel.deleteMany({ postId }).exec();
};

export const likesRepository = {
  likePost,
  dislikePost,
  deleteLikesByPostId,
};
