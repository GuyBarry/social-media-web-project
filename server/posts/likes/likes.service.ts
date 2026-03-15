import { LikeMethod } from "../../entities/dto/like.dto";
import { Post } from "../../entities/dto/post.dto";
import { NotFoundException } from "../../exceptions/notFoundException";
import { postRepository } from "../posts.repository";
import { likesRepository } from "./likes.repository";

export const handleLike = async (
  postId: string,
  userId: string,
  method: LikeMethod,
): Promise<void> => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new NotFoundException("Post", { postId });
  }

  if (method === "like") {
    await likesRepository.likePost(postId, userId);
  } else {
    const deleted = await likesRepository.dislikePost(postId, userId);
    if (!deleted) {
      throw new NotFoundException("Like", { postId, userId });
    }
  }
};

const deleteLikesByPostId = async (postId: Post["_id"]): Promise<void> => {
  await likesRepository.deleteLikesByPostId(postId);
};

export const likesService = {
  handleLike,
  deleteLikesByPostId,
};
