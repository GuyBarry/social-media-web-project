import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { postsApi } from "../../api/postsApi";
import type {
  Post,
  CreatePost,
  UpdatePost,
  LikeMethod,
  PaginatedPosts,
} from "../../entities/Post";

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: GetPostsParams) =>
    [...postKeys.lists(), params] as const,
  bySender: (senderId: string, params?: GetPostsParams) =>
    [...postKeys.all, "sender", senderId, params] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// ─── Params ─────────────────────────────────────────────────────────────────

export interface GetPostsParams {
  page?: number;
  limit?: number;
}

// ─── Queries ────────────────────────────────────────────────────────────────

export function useGetAllPosts(
  params: GetPostsParams = {},
  options?: Omit<UseQueryOptions<PaginatedPosts>, "queryKey" | "queryFn">,
) {
  return useQuery<PaginatedPosts>({
    queryKey: postKeys.list(params),
    queryFn: async () => {
      const { data } = await postsApi.get<PaginatedPosts>("/", {
        params,
      });
      return data;
    },
    ...options,
  });
}

export function useGetPostsBySender(
  senderId: string,
  params: GetPostsParams = {},
  options?: Omit<UseQueryOptions<PaginatedPosts>, "queryKey" | "queryFn">,
) {
  return useQuery<PaginatedPosts>({
    queryKey: postKeys.bySender(senderId, params),
    queryFn: async () => {
      const { data } = await postsApi.get<PaginatedPosts>("/", {
        params: { sender: senderId, ...params },
      });
      return data;
    },
    enabled: !!senderId,
    ...options,
  });
}

export function useGetPostById(
  id: string,
  options?: Omit<UseQueryOptions<Post>, "queryKey" | "queryFn">,
) {
  return useQuery<Post>({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const { data } = await postsApi.get<Post>(`/${id}`);
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePost & { pictureFile: File }) => {
      const formData = new FormData();
      formData.append("sender", postData.sender);
      formData.append("message", postData.message);
      formData.append("picture", postData.pictureFile);

      const { data } = await postsApi.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { message: string; postId: string; createdAt: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      postData,
    }: {
      id: string;
      postData: UpdatePost;
    }) => {
      const formData = new FormData();
      if (postData.message !== undefined)
        formData.append("message", postData.message);
      if (postData.picture !== undefined)
        formData.append("picture", postData.picture);

      const { data } = await postsApi.put(`/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { message: string; postId: string; updatedAt: string };
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, method }: { id: string; method: LikeMethod }) => {
      const { data } = await postsApi.patch(`/${id}/like`, { method });
      return data as { message: string };
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await postsApi.delete(`/${id}`);
      return data as { message: string };
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
