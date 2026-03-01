import { LikeModel } from "../../entities/mongodb/like.module";
import { handleDuplicateKeyException } from "../../exceptions/mongoException";

export const likePost = async (
  postId: string,
  userId: string
): Promise<void> => {
  const like = new LikeModel({ postId, userId });
  await like.save().catch(handleDuplicateKeyException);
};

export const dislikePost = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  const result = await LikeModel.deleteOne({ postId, userId }).exec();
  return result.deletedCount > 0;
};

export const likesRepository = {
  likePost,
  dislikePost,
};
