import {
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const BannerColorSwatch = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  overflow: "hidden",
  border: `2px solid ${theme.palette.divider}`,
  cursor: "pointer",
  flexShrink: 0,
  "& input[type='color']": {
    width: "200%",
    height: "200%",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transform: "translate(-25%, -25%)",
    appearance: "none",
    WebkitAppearance: "none",
    background: "none",
  },
}));

export const BannerColorPickerCard = styled(Box) ({
  borderRadius: 12,
  border: `1px solid #c4c4c4`,
  padding: "14px 16px",
  display: "flex",
  gap: 16,
  alignItems: "stretch",
});

export const BannerColorSwitchBox = styled(Box)({
  flex: "0 0 33.333%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
});

export const BannerColorPreview = styled(Box)<{ color: string }>(({ color, theme }) => ({
  width: "100%",
  aspectRatio: "1 / 1",
  maxWidth: 88,
  borderRadius: 10,
  backgroundColor: color,
  border: `2px solid ${theme.palette.divider}`,
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
  "& input[type='color']": {
    position: "absolute",
    inset: 0,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    border: "none",
    padding: 0,
  },
}));

export const BannerColorHexInput = styled("input")(({ theme }) => ({
  width: 80,
  textAlign: "center",
  fontSize: "0.72rem",
  fontFamily: "monospace",
  letterSpacing: 0.5,
  padding: "3px 6px",
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  outline: "none",
  "&:focus": {
    borderColor: theme.palette.primary.main,
  },
}));

export const SwatchGrid = styled(Box)({
  flex: "0 0 66.666%",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
  alignContent: "center",
  justifyItems: "center",
});

export const SwatchButton = styled("button")<{ swatchcolor: string; selected: boolean }>(
  ({ swatchcolor, selected, theme }) => ({
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: swatchcolor,
    border:
      swatchcolor.toLowerCase() === "#ffffff" || swatchcolor.toLowerCase() === "#fff"
        ? `1.5px solid ${theme.palette.grey[300]}`
        : "none",
    cursor: "pointer",
    padding: 0,
    outline: selected
      ? `3px solid ${theme.palette.primary.main}`
      : "none",
    outlineOffset: selected ? 3 : 0,
    transition: "outline 0.15s ease, outline-offset 0.15s ease, transform 0.1s ease",
    "&:hover": {
      transform: "scale(1.12)",
    },
  }),
);
