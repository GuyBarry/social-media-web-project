import { useEffect, useState } from "react";
import { CostumButton } from "../../../components/button/CostumButton.styled";
import { useGetTrending } from "../../../react/hooks/useTrending";
import {
  TIME_RANGE_BUTTONS,
  type TimeRange,
} from "../../../constants/timeRanges";
import {
  TrendingButtonGroup,
  TrendingCardContainer,
  TrendingDivider,
  TrendingEmptyText,
  TrendingLoadingBox,
  TrendingLoadingSpinner,
  TrendingTitle,
  TrendingTopicCard,
  TrendingTopicList,
  TrendingTopicName,
  TrendingTopicSummary,
} from "./trendingCard.styled";

export const TrendingCard = () => {
  const [selected, setSelected] = useState<TimeRange | null>(null);
  const {
    mutate: getTrending,
    data: result,
    isPending: loading,
  } = useGetTrending();

  useEffect(() => {
    handleSelectRange("1day");
  }, []);

  const handleSelectRange = (range: TimeRange) => {
    if (loading) return;
    setSelected(range);
    getTrending(range);
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
          <TrendingLoadingSpinner size={28} />
        </TrendingLoadingBox>
      )}

      {!loading && result && (
        <>
          {result.topics.length === 0 ? (
            <TrendingEmptyText>
              No posts found for this period yet!
            </TrendingEmptyText>
          ) : (
            <TrendingTopicList>
              {result.topics.map((topic) => (
                <TrendingTopicCard key={topic.topicName}>
                  <TrendingTopicName>{topic.topicName}</TrendingTopicName>
                  <TrendingTopicSummary>
                    {topic.shortSummary}
                  </TrendingTopicSummary>
                </TrendingTopicCard>
              ))}
            </TrendingTopicList>
          )}
        </>
      )}
    </TrendingCardContainer>
  );
};
