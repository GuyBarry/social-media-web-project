import { TrendingResult } from "../entities/dto/trending.dto";
import { TrendingResultModel } from "../entities/mongodb/trendingResult.module";
import { TrendingTimeRange } from "./trending.constants";

const ONE_HOUR_MS = 60 * 60 * 1000;

const findRecentByTimeRange = async (
  timeRange: TrendingTimeRange,
): Promise<TrendingResult | null> => {
  const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS);

  return TrendingResultModel.findOne({
    timeRange,
    generatedAt: { $gte: oneHourAgo },
  })
    .sort({ generatedAt: -1 })
    .lean<TrendingResult>();
};

const saveTrendingResult = async (result: TrendingResult): Promise<TrendingResult> => {
  const created = await TrendingResultModel.create(result);
  return created.toObject() as TrendingResult;
};

export const trendingRepository = {
  findRecentByTimeRange,
  saveTrendingResult,
};
