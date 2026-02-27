import { compare, hash } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../config/server.config";
import {
  ExpirationInSec,
  UserLogin,
  LoginTokens,
} from "../entities/dto/auth.dto";
import { User } from "../entities/dto/user.dto";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { usersService } from "../users/users.service";

const invalidCredentialsError = new UnauthorizedException(
  "User identification and/or password are wrong"
);

const loginUser = async (
  userCredentials: UserLogin
): Promise<{ user: User; tokens: LoginTokens }> => {
  const user = await getUserByCredentials(userCredentials);

  if (!user) {
    throw invalidCredentialsError;
  }

  const {
    password: hashedPassword,
    _id: userId,
    googleId,
    ...otherUserFields
  } = user;

  if (googleId) {
    throw new UnauthorizedException(
      "Exists google account connected to user, authenticate via Google"
    );
  }

  const isPasswordValid = await compare(
    userCredentials.password,
    hashedPassword
  );

  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  console.log({ _id: userId, ...otherUserFields } as User);
  return {
    user: { _id: userId, ...otherUserFields } as User,
    tokens: buildLoginTokens(userId),
  };
};

const refreshAccessToken = async (
  refreshToken: string | undefined
): Promise<LoginTokens> => {
  if (!refreshToken) {
    throw new UnauthorizedException("Missing refresh token");
  }

  try {
    const { userId } = jwt.verify(
      refreshToken,
      serverConfig.refreshTokenSecret
    ) as JwtPayload;

    const userResult = await usersService.doesUserExist(userId);

    if (!userResult) {
      throw new UnauthorizedException(
        "Invalid Refresh Token User Identification"
      );
    }

    return buildLoginTokens(userId);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException(
      "Invalid refresh token",
      (error as Error).stack
    );
  }
};

const getUserByCredentials = async ({
  username,
  email,
}: UserLogin): Promise<User | null> => {
  return username
    ? await usersService.getUserByUsername(username)
    : await usersService.getUserByEmail(email as User["email"]);
};

const buildLoginTokens = (userId: User["_id"]): LoginTokens => {
  const accessToken = jwt.sign({ userId }, serverConfig.accessTokenSecret, {
    expiresIn: ExpirationInSec.ONE_HOUR,
  });

  const refreshToken = jwt.sign({ userId }, serverConfig.refreshTokenSecret, {
    expiresIn: ExpirationInSec.ONE_DAY,
  });

  return {
    accessToken: {
      token: accessToken,
      cookieExpiry: ExpirationInSec.ONE_HOUR,
    },
    refreshToken: {
      token: refreshToken,
      cookieExpiry: ExpirationInSec.ONE_DAY,
    },
  };
};

export const authService = {
  loginUser,
  buildLoginTokens,
  refreshAccessToken,
};
