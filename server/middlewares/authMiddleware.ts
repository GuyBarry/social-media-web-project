import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_COOKIE_KEY } from "../auth/auth.contoller";
import { serverConfig } from "../config/server.config";
import { NotFoundException } from "../exceptions/notFoundException";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { usersService } from "../users/users.service";
import { UserPreview } from "../entities/dto/user.dto";

declare module "express" {
  interface Request {
    authUser?: UserPreview;
  }
}

export const validateAccessToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const accessToken: string | undefined =
    req.cookies?.[ACCESS_TOKEN_COOKIE_KEY];

  if (!accessToken) {
    throw new UnauthorizedException("Missing access token");
  }

  try {
    const { userId } = jwt.verify(
      accessToken,
      serverConfig.accessTokenSecret
    ) as JwtPayload;

    const userResult = await usersService.getUserById(userId);

    req.authUser = userResult;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    if (
      error instanceof NotFoundException &&
      error.message === "User does not exist"
    ) {
      throw new UnauthorizedException(
        "Invalid Refresh Token User Identification"
      );
    }

    throw new UnauthorizedException(
      "Invalid access token",
      (error as Error).stack
    );
  }
};

// const AUTHORIZATION_PREFIX = "Bearer";
// export const validateAccessToken = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction
// ) => {
//   const rawAccessToken = req.headers[serverConfig.authorizationHeader] as
//     | string
//     | undefined;

//   if (!rawAccessToken) {
//     throw new UnauthorizedException("Missing authorization header");
//   }

//   const [prefix, accessToken] = rawAccessToken.split(" ");

//   if (prefix !== AUTHORIZATION_PREFIX) {
//     throw new UnauthorizedException(
//       "Invalid authorization bearer header format"
//     );
//   }

//   try {
//     const { userId } = jwt.verify(
//       accessToken,
//       serverConfig.accessTokenSecret
//     ) as JwtPayload;

//     const user = await usersService.getUserById(userId);
//     req.authUser = user;

//     next();
//   } catch (error) {
//     if (error instanceof UnauthorizedException) {
//       throw error;
//     }

//     if (
//       error instanceof NotFoundException &&
//       error.message === "User does not exist"
//     ) {
//       throw new UnauthorizedException(
//         "Invalid Refresh Token User Identification"
//       );
//     }

//     throw new UnauthorizedException(
//       "Invalid access token",
//       (error as Error).stack
//     );
//   }
// };
