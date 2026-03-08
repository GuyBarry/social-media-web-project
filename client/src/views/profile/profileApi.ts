import { usersApi } from "../../api/usersApi";
import type { User } from "../../entities/User";

export const updateUser = async (
  userId: string,
  formData: FormData,
): Promise<User> => {
  const { data } = await usersApi.put<User>(`/${userId}`, formData);
  return data;
};
