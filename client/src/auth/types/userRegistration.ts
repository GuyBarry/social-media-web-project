import type { User } from "../../entities/User";

export type UserRegistration = Omit<User, "_id" | "createdAt" | "updatedAt">;
