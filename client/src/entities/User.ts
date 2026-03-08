export interface User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
  bio?: string;
  imageUrl?: string;
  birthDate: Date;
  bannerColor?: string;
  postsCount?: number;
  likesCount?: number;
}
