import SendIcon from "@mui/icons-material/Send";
import { CircularProgress } from "@mui/material";
import { type FC, type KeyboardEvent, useRef, useState } from "react";
import { ProfileAvatar } from "../../../components/profileAvatar/ProfileAvatar.styled";
import {
  useCreateComment,
  useGetCommentsByPostId,
} from "../../../react/hooks/useComments";
import { useGetUserById } from "../../../react/hooks/useUsers";
import { avatarImageSlotProps } from "../../../utils/avatar.utils";
import { formatTimestamp } from "../../../utils/time.utils";
import {
  AddCommentBox,
  CommentContent,
  CommentItem,
  CommentSenderRow,
  CommentsList,
  CommentsSection,
  CommentsSectionHeader,
  CommentsSectionTitle,
  CommentText,
  CommentTextarea,
  CommentTimestamp,
  CommentUsername,
  EmptyCommentsText,
  LoadMoreButton,
  SubmitCommentButton,
} from "./commentSection.styled";

interface CommentsSectionProps {
  postId: string;
  numComments: number;
}


export const PostCommentsSection: FC<CommentsSectionProps> = ({
  postId,
  numComments,
}) => {
  const { data: currentUser } = useGetUserById();

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetCommentsByPostId(postId);

  const { mutate: createComment, isPending: isSubmitting } = useCreateComment();

  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = commentsData?.pages.flatMap((page) => page.docs) ?? [];

  const handleSubmitComment = () => {
    const message = commentText.trim();
    if (!message || !currentUser) return;

    createComment(
      { sender: currentUser._id, message, postId },
      {
        onSuccess: () => {
          setCommentText("");
          setTimeout(() => textareaRef.current?.focus(), 0);
        },
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <CommentsSection>
      <CommentsSectionHeader>
        <CommentsSectionTitle>
          {numComments === 1 ? "1 Comment" : `${numComments} Comments`}
        </CommentsSectionTitle>
      </CommentsSectionHeader>

      {currentUser && (
        <AddCommentBox>
          <ProfileAvatar
            size={32}
            src={currentUser.imageUrl}
            slotProps={avatarImageSlotProps}
          />
          <CommentTextarea
            ref={textareaRef}
            placeholder="Write a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
          <SubmitCommentButton
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isSubmitting}
            aria-label="Send comment"
          >
            {isSubmitting ? (
              <CircularProgress size={18} />
            ) : (
              <SendIcon fontSize="small" />
            )}
          </SubmitCommentButton>
        </AddCommentBox>
      )}

      {isCommentsLoading ? (
        <CircularProgress size={24} sx={{ margin: "16px auto" }} />
      ) : comments.length === 0 ? (
        <EmptyCommentsText>
          No comments yet. Be the first to comment!
        </EmptyCommentsText>
      ) : (
        <CommentsList>
          {comments.map((comment) => (
            <CommentItem key={comment._id}>
              <ProfileAvatar
                size={32}
                src={comment.sender.imageUrl}
                slotProps={avatarImageSlotProps}
              />
              <CommentContent>
                <CommentSenderRow>
                  <CommentUsername>{comment.sender.username}</CommentUsername>
                  <CommentTimestamp>
                    {formatTimestamp(comment.createdAt)}
                  </CommentTimestamp>
                </CommentSenderRow>
                <CommentText>{comment.message}</CommentText>
              </CommentContent>
            </CommentItem>
          ))}

          {hasNextPage && (
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load more comments"}
            </LoadMoreButton>
          )}
        </CommentsList>
      )}
    </CommentsSection>
  );
};
