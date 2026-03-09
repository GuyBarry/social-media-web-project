import type { Paginated } from "./Pagination";
import type { User } from "./User";

export interface Comment {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  sender: Pick<User, "_id" | "username" | "imageUrl">;
  message: string;
  postId: string;
}

export type CreateComment = {
  sender: string;
  message: string;
  postId: string;
};

export type PaginatedComments = Paginated<Comment>;
