import { Box, Typography, styled } from "@mui/material";

export const PanelRoot = styled(Box)({
  display: "flex",
  width: "50%",
  flexShrink: 0,
  background:
    "linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-secondary-main) 100%)",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "48px",
  position: "relative",
  overflow: "hidden",
});

export const PanelContent = styled(Box)({
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  color: "white",
});

export const PanelIcon = styled(Box)({
  width: "80px",
  height: "80px",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
});

export const PanelBubbleTop = styled(Box)({
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  top: "-100px",
  right: "-100px",
});

export const PanelBubbleBottom = styled(Box)({
  position: "absolute",
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  bottom: "-50px",
  left: "-50px",
});

export const PanelSubtitle = styled(Typography)({
  opacity: 0.9,
});
