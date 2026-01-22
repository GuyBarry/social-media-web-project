import { Request, Response, Router } from "express";
import { validateRequestBody } from "../middlewares/requestBodyValidator";
import { createUserSchema } from "../entities/dto/user.dto";
import { usersService } from "../users/users.service";
import { authService } from "../auth/auth.service";
import { loginSchema } from "../entities/dto/auth.dto";
import { validateAccessToken } from "../middlewares/authMiddleware";

export const REFRESH_TOKEN_COOKIE_KEY = "refresh-token";

const router = Router();

router.post(
  "/registration",
  validateRequestBody(createUserSchema),
  async (req, res) => {
    const { _id: userId, createdAt } = await usersService.createUser(req.body);

    const { accessToken, refreshToken } = authService.buildLoginTokens(userId);

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.send({
      message: "successfully registered!",
      userId,
      createdAt,
      accessToken,
    });
  }
);

router.post("/login", validateRequestBody(loginSchema), async (req, res) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  res
    .cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    })
    .send({ accessToken });
});

router.post(
  "/logout",
  validateAccessToken,
  async (req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY).send({
      message: "User logged out",
      userId: req.userId,
    });
  }
);

router.post("/refresh", async (req, res) => {
  const refreshToken: string | undefined =
    req.cookies?.[REFRESH_TOKEN_COOKIE_KEY];

  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.send({ accessToken });
});

export const authController = router;
