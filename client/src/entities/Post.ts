export interface Post {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  sender: string;
  message: string;
  picture: string;
  likes: string[];
  numComments: number;
}

export interface CreatePost {
  sender: string;
  message: string;
  picture?: string;
}

export interface UpdatePost {
  message?: string;
  picture?: string;
}

export type LikeMethod = "like" | "dislike";

export interface LikeRequest {
  method: LikeMethod;
}

export interface PaginatedPosts {
  docs: Post[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
