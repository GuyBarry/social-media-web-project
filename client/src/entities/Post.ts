export interface Post {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  sender: string;
  message: string;
  imageUrl: string;
  likes: string[];
  numComments: number;
}

// image: File is the upload field (maps to imageUrl on the server)
type PostImageField = { image: File };

export type CreatePost = Pick<Post, "sender" | "message"> & PostImageField;

export type UpdatePost = Partial<Pick<Post, "message"> & PostImageField>;

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
