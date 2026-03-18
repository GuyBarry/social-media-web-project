import {
  rateLimit,
  RateLimitRequestHandler,
  Options as RateLimitOptions,
} from "express-rate-limit";

export const setUpRateLimit = (
  limitOptions?: Pick<RateLimitOptions, "limit" | "windowMs">,
): RateLimitRequestHandler =>
  rateLimit({
    ...limitOptions,
    legacyHeaders: false,
    standardHeaders: "draft-8",
  });
