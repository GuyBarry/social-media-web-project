import { hashSync } from "bcrypt";
import fs from "fs/promises";
import path from "path";
import { ACCESS_TOKEN_COOKIE_KEY } from "../auth/auth.contoller";
import { LoginTokens } from "../entities/dto/auth.dto";
import { CreateComment } from "../entities/dto/comment.dto";
import { CreatePost } from "../entities/dto/post.dto";
import { CreateUser } from "../entities/dto/user.dto";
import { CommentModel } from "../entities/mongodb/comment.module";
import { LikeModel } from "../entities/mongodb/like.module";
import { PostModel } from "../entities/mongodb/post.module";
import { UserModel } from "../entities/mongodb/user.module";
import { UPLOAD_DIR } from "../pictures/pictures.config";
import { PASSWORD_SALT_ROUNDS } from "../users/users.service";

export const loginUser = {
  _id: "loginUser",
  username: "loginuser",
  uniqueUsername: "loginuser#0001",
  email: "loginuser@example.com",
  birthDate: "2002-10-13",
  bio: "I am the best loginuser ever",
  imageUrl: "http://localhost/public/loginuser-avatar.png",
  password: hashSync("loginuserpassword", PASSWORD_SALT_ROUNDS),
};

export const examplePost: CreatePost = {
  _id: "1234",
  sender: loginUser._id,
  message: "Hello, world!",
  imageUrl: "http://localhost/public/example.png",
};

export const exampleLike = {
  postId: examplePost._id,
  userId: loginUser._id,
};

export const exampleComment: CreateComment = {
  _id: "5678",
  postId: "1234",
  sender: loginUser._id,
  message: "Nice post!",
};

export const exampleUser: CreateUser = {
  _id: "Mayan",
  username: "mayanamsterdam",
  uniqueUsername: "mayanamsterdam#0001",
  email: "mayan@example.com",
  birthDate: new Date("2002-10-13"),
  bio: "I am the best user ever",
  password: hashSync("thebestpasswordever", PASSWORD_SALT_ROUNDS),
};

export const getAuthCookies = (
  accessToken: LoginTokens["accessToken"]["token"]
) => [`${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`];

export const truncateDatabase = async (): Promise<void> => {
  await UserModel.deleteMany();
  await PostModel.deleteMany();
  await CommentModel.deleteMany();
  await LikeModel.deleteMany();
};

export const cleanupTestPictures = async (): Promise<void> => {
  const files = await fs.readdir(UPLOAD_DIR);
  const testFiles = files.filter((f) => f.endsWith("_test.png"));
  await Promise.all(
    testFiles.map((f) => fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => undefined))
  );
};
