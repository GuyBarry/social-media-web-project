import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../auth/context/authContext";
import type { User } from "../../entities/User";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: User["_id"]) => [...userKeys.all, "detail", id] as const,
};

export function useGetUserById(userId?: User["_id"]) {
  const { userId: authUserId } = useAuth();
  const id = userId ?? authUserId;

  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: async () => {
      const { data } = await usersApi.get<User>(`/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      formData,
    }: {
      userId: User["_id"];
      formData: FormData;
    }) => {
      const { data } = await usersApi.put<User>(`/${userId}`, formData);
      return data;
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
