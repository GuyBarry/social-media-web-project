import { compare } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../config/server.config";
import { Login, LoginTokens } from "../entities/dto/auth.dto";
import { User } from "../entities/dto/user.dto";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { usersService } from "../users/users.service";
import { ExpirationInSec } from "../entities/dto/auth.dto";

const invalidCredentialsError = new UnauthorizedException(
  "User credentials do not match"
);

const loginUser = async (userCredentials: Login): Promise<LoginTokens> => {
  const user = await getUserByCredentials(userCredentials);

  if (!user) {
    throw invalidCredentialsError;
  }

  const { password: hashedPassword, _id: userId } = user;

  const isPasswordValid = await compare(
    userCredentials.password,
    hashedPassword
  );

  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  return buildLoginTokens(userId);
};

const refreshAccessToken = async (
  refreshToken: string | undefined
): Promise<string> => {
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

    return generateAccessToken(userId);
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
}: Login): Promise<User | null> => {
  return username
    ? await usersService.getUserByUsername(username)
    : await usersService.getUserByEmail(email as User["email"]);
};

const buildLoginTokens = (userId: User["_id"]): LoginTokens => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken: {
      token: refreshToken,
      cookieExpiry: ExpirationInSec.ONE_DAY,
    },
  };
};

const generateAccessToken = (userId: User["_id"]): string => {
  return jwt.sign({ userId }, serverConfig.accessTokenSecret, {
    expiresIn: ExpirationInSec.ONE_HOUR,
  });
};

const generateRefreshToken = (userId: User["_id"]): string => {
  return jwt.sign({ userId }, serverConfig.refreshTokenSecret, {
    expiresIn: ExpirationInSec.ONE_DAY,
  });
};

export const authService = {
  loginUser,
  buildLoginTokens,
  refreshAccessToken,
};
