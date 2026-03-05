export interface User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
  birthDate: Date;
  postsCount?: number;
  likesCount?: number;
}
