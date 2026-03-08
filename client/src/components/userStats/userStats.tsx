import { Typography } from "@mui/material";
import { StatItem, StatsContainer } from "./userStats.styled";

interface UserStatsProps {
  postsCount?: number;
  likesCount?: number;
}

export const UserStats = ({ postsCount = 0, likesCount = 0 }: UserStatsProps) => {
  const stats = [
    { label: "Posts", value: postsCount },
    { label: "Likes", value: likesCount },
  ];

  return (
    <StatsContainer>
      {stats.map(({ label, value }) => (
        <StatItem key={label}>
          <Typography variant="h6" fontWeight={700}>
            {value.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </StatItem>
      ))}
    </StatsContainer>
  );
};
