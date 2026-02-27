import { hashSync } from "bcrypt";
import { ACCESS_TOKEN_COOKIE_KEY } from "../auth/auth.contoller";
import { LoginTokens } from "../entities/dto/auth.dto";
import { CreateComment } from "../entities/dto/comment.dto";
import { CreatePost } from "../entities/dto/post.dto";
import { CreateUser } from "../entities/dto/user.dto";
import { CommentModel } from "../entities/mongodb/comment.module";
import { PostModel } from "../entities/mongodb/post.module";
import { UserModel } from "../entities/mongodb/user.module";
import { PASSWORD_SALT_ROUNDS } from "../users/users.service";

export const loginUser = {
  _id: "loginUser",
  username: "loginuser",
  email: "loginuser@example.com",
  birthDate: "2002-10-13",
  bio: "I am the best loginuser ever",
  password: hashSync("loginuserpassword", PASSWORD_SALT_ROUNDS),
};

export const examplePost: CreatePost = {
  _id: "1234",
  sender: loginUser._id,
  message: "Hello, world!",
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
  email: "mayan@example.com",
  birthDate: "2002-10-13",
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
};
