import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Dialog, DialogContent } from "@mui/material";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../entities/Post";
import { useDeletePost } from "../../react/hooks/usePosts";
import { useGetUserById } from "../../react/hooks/useUsers";
import { avatarImageSlotProps } from "../../utils/avatar.utils";
import { formatTimestamp } from "../../utils/time.utils";
import { ConfirmationDialog } from "../dialog/ConfirmationDialog";
import { EditPost } from "../createEditPost/editPost";
import { ProfileAvatar } from "../profileAvatar/ProfileAvatar.styled";
import {
  CommentButton,
  EngagementItem,
  EngagementText,
  EditPostDialog,
  EditPostDialogContent,
  LikeButton,
  PostActionsGroup,
  PostCaption,
  PostCard,
  PostDeleteButton,
  PostEditButton,
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

export const PostComponent: FC<PostProps> = ({
  post,
  onLike,
  onDislike,
  onComment,
}) => {
  const { data: user } = useGetUserById();
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const isLiked = !!user && post.likes.includes(user._id);
  const isOwner = !!user && user._id === post.sender._id;

  const handleLikeClick = () => {
    if (isLiked) {
      onDislike?.(post._id);
    } else {
      onLike?.(post._id);
    }
  };

  const handleDeleteConfirm = () => {
    deletePost(post._id);
    setDeleteConfirmationOpen(false);
  };

  const handleCommentClick = () => {
    if (onComment) {
      onComment(post._id);
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  return (
    <PostCard>
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
        {isOwner && (
          <PostActionsGroup>
            <PostEditButton
              aria-label="Edit post"
              onClick={() => setEditDialogOpen(true)}
            >
              <EditOutlinedIcon fontSize="small" />
            </PostEditButton>
            <PostDeleteButton
              aria-label="Delete post"
              onClick={() => setDeleteConfirmationOpen(true)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </PostDeleteButton>
          </PostActionsGroup>
        )}
      </PostHeader>

      {post.message && <PostCaption>{post.message}</PostCaption>}

      <PostImageContainer>
        <PostImage src={post.imageUrl} alt="post" />
      </PostImageContainer>

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

        <EngagementItem onClick={handleCommentClick}>
          <CommentButton>
            <ChatBubbleOutlineIcon fontSize="small" />
            <EngagementText>
              {post.numComments}{" "}
              {post.numComments === 1 ? "Comment" : "Comments"}
            </EngagementText>
          </CommentButton>
        </EngagementItem>
      </PostEngagementBar>

      <ConfirmationDialog
        open={isDeleteConfirmationOpen}
        title="Delete post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmationOpen(false)}
      />

      {user && (
        <EditPostDialog
          open={isEditDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          disableScrollLock
        >
          <EditPostDialogContent>
            <EditPost
              user={user}
              initialPost={post}
              onSave={() => setEditDialogOpen(false)}
            />
          </EditPostDialogContent>
        </EditPostDialog>
      )}
    </PostCard>
  );
};
