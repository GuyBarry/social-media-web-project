import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postsApi } from "../../api/postsApi";
import type {
  Post,
  CreatePost,
  UpdatePost,
  LikeMethod,
  PaginatedPosts,
} from "../../entities/Post";
import type { User } from "../../entities/User";

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const postKeys = {
  all: ["posts"] as const,
  infinite: () => [...postKeys.all, "infinite"] as const,
  listsInfinite: (limit: number) => [...postKeys.infinite(), limit] as const,
  bySenderInfinite: (senderId: User["_id"], limit: number) =>
    [...postKeys.all, "sender", senderId, limit] as const,
  detail: (id: Post["_id"]) => [...postKeys.all, "detail", id] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────

export function useGetAllPostsInfinite(limit = 10) {
  return useInfiniteQuery<PaginatedPosts>({
    queryKey: postKeys.listsInfinite(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await postsApi.get<PaginatedPosts>("/", {
        params: { page: pageParam, limit },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
}

export function useGetPostsBySender(senderId: User["_id"], limit = 10) {
  return useInfiniteQuery<PaginatedPosts>({
    queryKey: postKeys.bySenderInfinite(senderId, limit),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await postsApi.get<PaginatedPosts>("/", {
        params: { sender: senderId, page: pageParam, limit },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!senderId,
  });
}

export function useGetPostById(id: Post["_id"]) {
  return useQuery<Post>({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const { data } = await postsApi.get<Post>(`/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePost) => {
      const formData = new FormData();
      formData.append("sender", postData.sender);
      formData.append("message", postData.message);
      formData.append("image", postData.image);

      const { data } = await postsApi.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { message: string; postId: string; createdAt: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...postData
    }: { id: Post["_id"] } & UpdatePost) => {
      const formData = new FormData();
      if (postData.message !== undefined)
        formData.append("message", postData.message);
      if (postData.image !== undefined)
        formData.append("image", postData.image);

      const { data } = await postsApi.put(`/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { message: string; postId: string; updatedAt: string };
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      method,
    }: {
      id: Post["_id"];
      method: LikeMethod;
    }) => {
      const { data } = await postsApi.patch(`/${id}/like`, { method });
      return data as { message: string };
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Post["_id"]) => {
      const { data } = await postsApi.delete(`/${id}`);
      return data as { message: string };
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
