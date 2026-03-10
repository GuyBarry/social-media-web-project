import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress, Typography } from "@mui/material";
import { type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostComponent } from "../../components/post/post";
import { useGetPostById, useLikePost } from "../../react/hooks/usePosts";
import { PostCommentsSection } from "./comments/commentSection";
import {
  BackButton,
  PostDetailContent,
  PostDetailHeader,
  PostDetailPage,
} from "./postDetail.styled";

export const PostDetailScreen: FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { mutate: likePost } = useLikePost();

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useGetPostById(postId ?? "");

  const handleBack = () => {
    navigate(-1);
  };

  if (isPostLoading) {
    return (
      <PostDetailPage sx={{ alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </PostDetailPage>
    );
  }

  if (isPostError || !post) {
    return (
      <PostDetailPage sx={{ alignItems: "center", justifyContent: "center" }}>
        <Typography color="error">Post not found.</Typography>
      </PostDetailPage>
    );
  }

  return (
    <PostDetailPage>
      <PostDetailHeader>
        <BackButton onClick={handleBack} aria-label="Back to feed">
          <ArrowBackIcon fontSize="small" />
          Back to feed
        </BackButton>
      </PostDetailHeader>

      <PostDetailContent>
        <PostComponent
          post={post}
          onLike={(id) =>
            likePost({ id, senderId: post.sender._id, method: "like" })
          }
          onDislike={(id) =>
            likePost({ id, senderId: post.sender._id, method: "dislike" })
          }
          onComment={() => {}}
        />

        <PostCommentsSection
          postId={post._id}
          numComments={post.numComments}
        />
      </PostDetailContent>
    </PostDetailPage>
  );
};
