import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { validateExistingSender } from "../middlewares/validateExistingUser";
import { trendingService, TrendingTimeRange, VALID_TIME_RANGES } from "./trending.service";

const router = Router();

// Get trending topics based on real posts within a time range
router.post(
  "/",
  validateExistingSender,
  async (req: Request<{}, {}, { sender: string; timeRange: TrendingTimeRange }>, res: Response) => {
    const { timeRange } = req.body || {};

    if (!VALID_TIME_RANGES.includes(timeRange)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: `Field 'timeRange' must be one of: ${VALID_TIME_RANGES.join(", ")}.` });
    }

    const content = await trendingService.getTrending(timeRange);

    res.status(StatusCodes.OK).send({ content });
  },
);

export const trendingController = router;
