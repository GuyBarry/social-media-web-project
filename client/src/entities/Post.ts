import type { Paginated } from "./Pagination";
import type { User } from "./User";

export interface Post {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  sender: Pick<User, "_id" | "username" | "imageUrl">;
  message: string;
  imageUrl: string;
  likes: string[];
  numComments: number;
}

// image: File is the upload field (maps to imageUrl on the server)
type PostImageField = { image: File };

export type CreatePost = Pick<Post, "message"> & {
  sender: string;
} & PostImageField;

export type UpdatePost = Partial<Pick<Post, "message"> & PostImageField>;

export type LikeMethod = "like" | "dislike";

export interface LikeRequest {
  method: LikeMethod;
}

export type PaginatedPosts = Paginated<Post>;
