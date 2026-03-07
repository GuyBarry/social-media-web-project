import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useGetAllPostsInfinite, useLikePost } from "../../react/hooks/usePosts";
import { PostComponent } from "../post/post";
import { FeedCenter, FeedContainer, FeedList } from "./feed.styled";

const POSTS_PER_PAGE = 1; //TODO: change to 10 in production

export const FeedComponent = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPostsInfinite(POSTS_PER_PAGE);

  const { mutate: likePost } = useLikePost();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <FeedCenter>
        <CircularProgress />
      </FeedCenter>
    );
  }

  if (isError || !data) {
    return (
      <FeedCenter>
        <Typography color="error">Failed to load posts.</Typography>
      </FeedCenter>
    );
  }

  const posts = data.pages.flatMap((page) => page.docs);

  return (
    <FeedContainer>
      <FeedList>
        {posts.map((post) => (
          <PostComponent
            key={post._id}
            post={post}
            onLike={(id) => likePost({ id, method: "like" })}
            onDislike={(id) => likePost({ id, method: "dislike" })}
          />
        ))}
      </FeedList>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <FeedCenter sx={{ padding: "16px 0" }}>
          <CircularProgress size={28} />
        </FeedCenter>
      )}
    </FeedContainer>
  );
};
