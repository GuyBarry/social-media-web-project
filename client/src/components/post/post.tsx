import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Typography } from "@mui/material";
import { ProfileAvatar } from "../shared.styled";
import { useAuth } from "../../auth/context/authContext";
import type { Post } from "../../entities/Post";
import {
  CommentButton,
  EngagementText,
  EngagementItem,
  LikeButton,
  PostCard,
  PostCaption,
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
  const { user } = useAuth();

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
        <ProfileAvatar size={40} src={undefined}>
          {post.sender.username.charAt(0).toUpperCase()}
        </ProfileAvatar>
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
          <LikeButton size="small">
            {isLiked ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </LikeButton>
          <EngagementText color={isLiked ? "error" : "text.secondary"}>
            {post.likes.length}
          </EngagementText>
        </EngagementItem>

        <EngagementItem onClick={() => onComment?.(post._id)}>
          <CommentButton size="small">
            <ChatBubbleOutlineIcon fontSize="small" />
          </CommentButton>
          <EngagementText>
            {post.numComments} {post.numComments === 1 ? "Comment" : "Comments"}
          </EngagementText>
        </EngagementItem>
      </PostEngagementBar>
    </PostCard>
  );
};
