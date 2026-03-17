import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { trendingService } from "./trending.service";
import { TrendingTimeRange, VALID_TIME_RANGES } from "./trending.constants";
import type { TrendingResult } from "../entities/dto/trending.dto";

const router = Router();

router.post(
  "/",
  async (
    req: Request<{}, TrendingResult, { timeRange: TrendingTimeRange }>,
    res: Response,
  ) => {
    const { timeRange } = req.body || {};

    if (!VALID_TIME_RANGES.includes(timeRange)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({
          error: `Field 'timeRange' must be one of: ${VALID_TIME_RANGES.join(", ")}.`,
        });
    }

    const result = await trendingService.getTrending(timeRange);

    res.status(StatusCodes.OK).send(result);
  },
);

export const trendingController = router;
