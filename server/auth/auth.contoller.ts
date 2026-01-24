import { Request, Response, Router } from "express";
import passport from "passport";
import { authService } from "../auth/auth.service";
import { serverConfig } from "../config/server.config";
import { userLoginSchema } from "../entities/dto/auth.dto";
import { createUserSchema, UserPreview } from "../entities/dto/user.dto";
import { validateAccessToken } from "../middlewares/authMiddleware";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { usersService } from "../users/users.service";

export const REFRESH_TOKEN_COOKIE_KEY = "refresh-token";
export const ACCESS_TOKEN_COOKIE_KEY = "access-token";

const router = Router();

router.post(
  "/registration",
  validateRequestBody(createUserSchema),
  async (req, res) => {
    const user = await usersService.createUser(req.body);

    const { accessToken, refreshToken } = authService.buildLoginTokens(
      user._id
    );

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: accessToken.cookieExpiry * 1_000,
    });

    res.send({ userId: user._id });
  }
);

router.post(
  "/login",
  validateRequestBody(userLoginSchema),
  async (req, res) => {
    const {
      user,
      tokens: { accessToken, refreshToken },
    } = await authService.loginUser(req.body);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: accessToken.cookieExpiry * 1_000,
    });

    res.send({ userId: user._id });
  }
);

router.post(
  "/logout",
  validateAccessToken,
  async (req: Request, res: Response) => {
    res
      .clearCookie(REFRESH_TOKEN_COOKIE_KEY)
      .clearCookie(ACCESS_TOKEN_COOKIE_KEY)
      .send({
        message: "User logged out",
      });
  }
);

router.post("/refresh", async (req, res) => {
  const refreshToken: string | undefined =
    req.cookies?.[REFRESH_TOKEN_COOKIE_KEY];

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(refreshToken);

  res.cookie(REFRESH_TOKEN_COOKIE_KEY, newRefreshToken.token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: newRefreshToken.cookieExpiry * 1_000,
  });

  res
    .cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: accessToken.cookieExpiry * 1_000,
    })
    .send({ message: "refreshed" });
});

router.post("/me", validateAccessToken, async (req: Request, res: Response) => {
  const user = req.authUser;

  res.json({ user });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${serverConfig.clientUrl}`,
    session: false,
  }),
  (req, res) => {
    const authUser = req.user as UserPreview;
    const { accessToken, refreshToken } = authService.buildLoginTokens(
      authUser._id
    );

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: accessToken.cookieExpiry * 1_000,
    });

    res.redirect(serverConfig.clientUrl);
  }
);

export const authController = router;
