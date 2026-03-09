import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { commentsApi } from "../../api/commentsApi";
import type {
  Comment,
  CreateComment,
  PaginatedComments,
} from "../../entities/Comment";
import type { Post } from "../../entities/Post";
import { postKeys } from "./usePosts";

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: Post["_id"]) => [...commentKeys.all, "post", postId] as const,
  byPostInfinite: (postId: Post["_id"], limit: number) =>
    [...commentKeys.byPost(postId), "infinite", limit] as const,
};

const COMMENTS_PER_PAGE = 10;

export function useGetCommentsByPostId(postId: Post["_id"]) {
  return useInfiniteQuery<PaginatedComments>({
    queryKey: commentKeys.byPostInfinite(postId, COMMENTS_PER_PAGE),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await commentsApi.get<PaginatedComments>("/", {
        params: { postId, page: pageParam, limit: COMMENTS_PER_PAGE },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: CreateComment) => {
      const { data } = await commentsApi.post<{
        message: string;
        commentId: Comment["_id"];
        createdAt: string;
      }>("/", commentData);
      return data;
    },
    onSuccess: (_data, commentData) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(commentData.postId),
      });
      // Invalidate the post so numComments updates
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(commentData.postId),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
}

export function useDeleteComment(postId: Post["_id"]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: Comment["_id"]) => {
      const { data } = await commentsApi.delete(`/${commentId}`);
      return data as { message: string; commentId: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
}
