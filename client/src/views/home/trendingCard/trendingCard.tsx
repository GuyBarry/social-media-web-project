import { CircularProgress, useTheme } from "@mui/material";
import { useState } from "react";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { trendingApi } from "../../../api/trendingApi";
import {
  TrendingButtonGroup,
  TrendingCardContainer,
  TrendingDivider,
  TrendingLoadingBox,
  TrendingResultBox,
  TrendingResultText,
  TrendingTitle,
} from "./trendingCard.styled";

type TimeRange = "1day" | "3days" | "1week";

const TIME_RANGE_BUTTONS: { label: string; value: TimeRange }[] = [
  { label: "1 day", value: "1day" },
  { label: "3 days", value: "3days" },
  { label: "1 week", value: "1week" },
];

export const TrendingCard = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState<TimeRange | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectRange = async (range: TimeRange) => {
    if (loading) return;
    setSelected(range);
    setResult(null);
    setLoading(true);

    try {
      const response = await trendingApi.post<{ content: string }>("/", {
        timeRange: range,
      });
      setResult(response.data.content);
    } catch {
      setResult("Failed to fetch trending topics. Please try again.");
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
        <TrendingResultBox>
          <TrendingResultText>{result}</TrendingResultText>
        </TrendingResultBox>
      )}
    </TrendingCardContainer>
  );
};
