import { Box, styled } from "@mui/material";

export const CropWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  borderRadius: "12px",
  overflow: "hidden",
  lineHeight: 0,
  userSelect: "none",
  touchAction: "none",
  cursor: "crosshair",
});

export const CropImage = styled("img")({
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "12px",
  pointerEvents: "none",
  draggable: "false",
});

export const CropOverlay = styled(Box)({
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  borderRadius: "12px",
  pointerEvents: "none",
});

export const CropSelection = styled(Box)({
  position: "absolute",
  border: "2px solid #fff",
  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
  cursor: "move",
  boxSizing: "border-box",
});

export const CropHandle = styled(Box)({
  position: "absolute",
  width: "12px",
  height: "12px",
  backgroundColor: "#fff",
  border: "2px solid rgba(0,0,0,0.3)",
  borderRadius: "50%",
  boxSizing: "border-box",
});

export const CropActionsRow = styled(Box)({
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
  paddingTop: "10px",
});

export const RatioToggleRow = styled(Box)({
  display: "flex",
  gap: "8px",
  paddingBottom: "10px",
});
