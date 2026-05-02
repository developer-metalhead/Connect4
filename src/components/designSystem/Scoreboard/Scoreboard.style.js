import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../tokens";

const cardSheen = keyframes`
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(300%) skewX(-20deg); }
`;

const avatarPulseRed = keyframes`
  0%, 100% { box-shadow: 0 0 10px 2px rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 20px 6px rgba(239, 68, 68, 0.8); }
`;

const avatarPulseYellow = keyframes`
  0%, 100% { box-shadow: 0 0 10px 2px rgba(255, 221, 0, 0.4); }
  50% { box-shadow: 0 0 20px 6px rgba(255, 221, 0, 0.8); }
`;

export const ScoreboardCard = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  width: "100%",
  maxWidth: "600px",
  gap: "16px",
  boxShadow: tokens.shadows.xl,

  "@media (max-width: 768px)": {
    padding: "6px 12px", // Tighter padding
    gap: "4px",
    borderRadius: tokens.radius.md,
    maxWidth: "400px", // Limit width on mobile
  }
});

export const PlayerInfo = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px", // Reduced gap
  flex: 1,
  opacity: active ? 1 : 0.6,
  transition: tokens.transition,
  transform: active ? "scale(1.05)" : "scale(1)",
  position: "relative",
  
  ...(active && {
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-8px", // Closer to name
      width: "20px",
      height: "3px",
      backgroundColor: tokens.colors.primary,
      borderRadius: "2px",
      boxShadow: "0 0 10px rgba(59, 130, 246, 0.6)",
    },
  })
}));

export const Avatar = styled("div", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "active",
})(({ color, active }) => ({
  width: "clamp(28px, 7vw, 40px)", // Slightly smaller
  height: "clamp(28px, 7vw, 40px)",
  borderRadius: "50%",
  backgroundColor: color === "red" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 221, 0, 0.15)",
  border: `2px solid ${color === "red" ? "#ef4444" : "#ffdd00"}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "clamp(14px, 4vw, 20px)",
  animation: active 
    ? `${color === "red" ? avatarPulseRed : avatarPulseYellow} 1.5s infinite ease-in-out` 
    : "none",
}));

export const PlayerName = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  fontSize: "clamp(11px, 2.8vw, 14px)", // Smaller name
  fontWeight: active ? 700 : 600,
  color: active ? "#ffffff" : tokens.colors.text,
  textAlign: "center",
  maxWidth: "100px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: tokens.transition,
  textShadow: active ? "0 0 8px rgba(255,255,255,0.4)" : "none",
}));

export const ScoreValue = styled("div")({
  fontSize: "24px", // Smaller score
  fontWeight: 800,
  color: tokens.colors.text,
  fontFamily: "'Inter', sans-serif",
  
  "@media (max-width: 768px)": {
    fontSize: "18px", // Even smaller for mobile
  }
});

export const VersusLabel = styled("div")({
  fontSize: "10px", // Smaller vs text
  fontWeight: 700,
  color: tokens.colors.textDim,
  textTransform: "uppercase",
  letterSpacing: "1px",
  padding: "2px 8px", // Tighter padding
  borderRadius: tokens.radius.full,
  border: `1px solid ${tokens.colors.borderLight}`,
});
