import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../auth/context/authContext";
import type { User } from "../../entities/User";

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const userKeys = {
  all: ["users"] as const,
  detail: (id: User["_id"]) => [...userKeys.all, "detail", id] as const,
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

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
    onSuccess: async (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      await refreshUser();
    },
  });
}
