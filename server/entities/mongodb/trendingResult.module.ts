import { model, Schema } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { TrendingResult } from "../dto/trending.dto";
import { VALID_TIME_RANGES } from "../../trending/trending.constants";

const trendingTopicSchema = new Schema(
  {
    topicName: { type: String, required: true },
    shortSummary: { type: String, required: true },
  },
  { _id: false },
);

const trendingResultSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    topics: {
      type: [trendingTopicSchema],
      required: true,
    },
    generatedAt: {
      type: Date,
      required: true,
    },
    timeRange: {
      type: String,
      enum: VALID_TIME_RANGES,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

export const TrendingResultModel = model<TrendingResult>(
  "TrendingResult",
  trendingResultSchema,
);
