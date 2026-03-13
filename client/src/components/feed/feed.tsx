import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, type FC } from "react";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import { useLikePost } from "../../react/hooks/usePosts";
import type { PaginatedPosts } from "../../entities/Post";
import { PostComponent } from "../post/post";
import { FeedCenter, FeedContainer, FeedGrid } from "./feed.styled";

interface FeedProps {
  queryResult: UseInfiniteQueryResult<InfiniteData<PaginatedPosts>>;
  columns?: number;
}

export const FeedComponent: FC<FeedProps> = ({ queryResult, columns = 1 }) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = queryResult;

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
      <FeedGrid $columns={columns}>
        {posts.map((post) => (
          <PostComponent
            key={post._id}
            post={post}
            truncateCaption
            onLike={(id) => likePost({ id, senderId: post.sender._id, method: "like" })}
            onDislike={(id) => likePost({ id, senderId: post.sender._id, method: "dislike" })}
          />
        ))}
      </FeedGrid>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <FeedCenter sx={{ padding: "16px 0" }}>
          <CircularProgress size={28} />
        </FeedCenter>
      )}
    </FeedContainer>
  );
};
