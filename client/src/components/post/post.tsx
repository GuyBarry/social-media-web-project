import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useGetUserById } from "../../react/hooks/useUsers";
import type { Post } from "../../entities/Post";
import { ProfileAvatar } from "../shared.styled";
import { avatarImageSlotProps } from "../../views/profile/profile.utils";
import {
  CommentButton,
  EngagementItem,
  EngagementText,
  LikeButton,
  PostCaption,
  PostCard,
  PostEngagementBar,
  PostHeader,
  PostImage,
  PostImageContainer,
  PostTimestamp,
  PostUserInfo,
  PostUsername,
} from "./post.styled";

interface PostProps {
  post: Post;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onComment?: (id: string) => void;
}

const formatTimestamp = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PostComponent = ({
  post,
  onLike,
  onDislike,
  onComment,
}: PostProps) => {
  const { data: user } = useGetUserById();

  const isLiked = !!user && post.likes.includes(user._id);

  const handleLikeClick = () => {
    if (isLiked) {
      onDislike?.(post._id);
    } else {
      onLike?.(post._id);
    }
  };

  return (
    <PostCard>
      {/* Header */}
      <PostHeader>
        <ProfileAvatar
          size={40}
          src={post.sender.imageUrl}
          slotProps={avatarImageSlotProps}
        />
        <PostUserInfo>
          <PostUsername>{post.sender.username}</PostUsername>
          <PostTimestamp>{formatTimestamp(post.createdAt)}</PostTimestamp>
        </PostUserInfo>
      </PostHeader>

      {/* Caption */}
      {post.message && <PostCaption>{post.message}</PostCaption>}

      {/* Image */}
      <PostImageContainer>
        <PostImage src={post.imageUrl} alt="post" />
      </PostImageContainer>

      {/* Engagement bar */}
      <PostEngagementBar>
        <EngagementItem onClick={handleLikeClick}>
          <LikeButton isLiked={isLiked}>
            {isLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
            <EngagementText>{post.likes.length}</EngagementText>
          </LikeButton>
        </EngagementItem>

        <EngagementItem onClick={() => onComment?.(post._id)}>
          <CommentButton>
            <ChatBubbleOutlineIcon fontSize="small" />
            <EngagementText>
              {post.numComments}{" "}
              {post.numComments === 1 ? "Comment" : "Comments"}
            </EngagementText>
          </CommentButton>
        </EngagementItem>
      </PostEngagementBar>
    </PostCard>
  );
};
