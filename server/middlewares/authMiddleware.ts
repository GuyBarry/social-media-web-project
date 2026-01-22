import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../config/server.config";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { usersService } from "../users/users.service";

const AUTHORIZATION_PREFIX = "Bearer";

declare module "express" {
  interface Request {
    userId?: string;
  }
}

export const validateAccessToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const rawAccessToken = req.headers[serverConfig.authorizationHeader] as
    | string
    | undefined;

  if (!rawAccessToken) {
    throw new UnauthorizedException("Missing authorization header");
  }

  const [prefix, accessToken] = rawAccessToken.split(" ");

  if (prefix !== AUTHORIZATION_PREFIX) {
    throw new UnauthorizedException(
      "Invalid authorization bearer header format"
    );
  }

  try {
    const { userId } = jwt.verify(
      accessToken,
      serverConfig.accessTokenSecret
    ) as JwtPayload;

    const userResult = await usersService.doesUserExist(userId);

    if (!userResult) {
      throw new UnauthorizedException(
        "Invalid Refresh Token User Identification"
      );
    }

    req.userId = userId;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException(
      "Invalid access token",
      (error as Error).stack
    );
  }
};
