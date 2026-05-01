import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const ScoreboardCard = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 32px",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  width: "100%",
  maxWidth: "600px",
  gap: "24px",
  boxShadow: tokens.shadows.xl,
});

export const PlayerInfo = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  flex: 1,
  opacity: active ? 1 : 0.6,
  transition: tokens.transition,
  transform: active ? "scale(1.05)" : "scale(1)",
  position: "relative",
  
  ...(active && {
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-12px",
      width: "20px",
      height: "3px",
      backgroundColor: tokens.colors.primary,
      borderRadius: "2px",
      boxShadow: "0 0 10px rgba(59, 130, 246, 0.6)",
    }
  })
}));

export const Avatar = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})(({ color }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: color === "red" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 221, 0, 0.15)",
  border: `2px solid ${color === "red" ? "#ef4444" : "#ffdd00"}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  boxShadow: `0 0 20px ${color === "red" ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 221, 0, 0.2)"}`,
}));

export const PlayerName = styled("div")({
  fontSize: "14px",
  fontWeight: 600,
  color: tokens.colors.text,
  textAlign: "center",
  maxWidth: "120px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const ScoreValue = styled("div")({
  fontSize: "28px",
  fontWeight: 800,
  color: tokens.colors.text,
  fontFamily: "'Inter', sans-serif",
});

export const VersusLabel = styled("div")({
  fontSize: "12px",
  fontWeight: 700,
  color: tokens.colors.textDim,
  textTransform: "uppercase",
  letterSpacing: "2px",
  padding: "4px 12px",
  borderRadius: tokens.radius.full,
  border: `1px solid ${tokens.colors.borderLight}`,
});
