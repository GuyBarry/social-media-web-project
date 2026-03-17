import { CircularProgress, useTheme } from "@mui/material";
import { useState } from "react";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { trendingApi } from "../../../api/trendingApi";
import {
  TrendingButtonGroup,
  TrendingCardContainer,
  TrendingDivider,
  TrendingEmptyText,
  TrendingLoadingBox,
  TrendingTitle,
  TrendingTopicCard,
  TrendingTopicList,
  TrendingTopicName,
  TrendingTopicSummary,
} from "./trendingCard.styled";

type TimeRange = "1day" | "3days" | "1week";

interface TrendingTopic {
  topicName: string;
  shortSummary: string;
}

interface TrendingResult {
  topics: TrendingTopic[];
}

const TIME_RANGE_BUTTONS: { label: string; value: TimeRange }[] = [
  { label: "1 day", value: "1day" },
  { label: "3 days", value: "3days" },
  { label: "1 week", value: "1week" },
];

export const TrendingCard = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState<TimeRange | null>(null);
  const [result, setResult] = useState<TrendingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectRange = async (range: TimeRange) => {
    if (loading) return;
    setSelected(range);
    setResult(null);
    setLoading(true);

    try {
      const response = await trendingApi.post<TrendingResult>("/", {
        timeRange: range,
      });
      setResult(response.data);
    } catch {
      setResult({ topics: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrendingCardContainer>
      <TrendingTitle variant="subtitle1">🔥 What's Trending?</TrendingTitle>

      <TrendingDivider />

      <TrendingButtonGroup>
        {TIME_RANGE_BUTTONS.map(({ label, value }) => (
          <CostumButton
            key={value}
            variant={selected === value ? "contained" : "outlined"}
            onClick={() => handleSelectRange(value)}
            disabled={loading}
          >
            {label}
          </CostumButton>
        ))}
      </TrendingButtonGroup>

      {loading && (
        <TrendingLoadingBox>
          <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
        </TrendingLoadingBox>
      )}

      {!loading && result && (
        <>
          {result.topics.length === 0 ? (
            <TrendingEmptyText>No posts found for this period yet!</TrendingEmptyText>
          ) : (
            <TrendingTopicList>
              {result.topics.map((topic) => (
                <TrendingTopicCard key={topic.topicName}>
                  <TrendingTopicName>{topic.topicName}</TrendingTopicName>
                  <TrendingTopicSummary>{topic.shortSummary}</TrendingTopicSummary>
                </TrendingTopicCard>
              ))}
            </TrendingTopicList>
          )}
        </>
      )}
    </TrendingCardContainer>
  );
};
