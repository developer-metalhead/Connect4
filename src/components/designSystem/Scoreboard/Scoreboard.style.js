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
    padding: "8px 16px",
    gap: "8px",
    borderRadius: tokens.radius.md,
  }
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
      width: "30px",
      height: "4px",
      backgroundColor: tokens.colors.primary,
      borderRadius: "2px",
      boxShadow: "0 0 12px rgba(59, 130, 246, 0.8)",
    },
    // "&::before": {
    //   content: '""',
    //   position: "absolute",
    //   top: 0, left: 0, bottom: 0, right: 0,
    //   background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
    //   transform: "skewX(-20deg)",
    //   animation: `${cardSheen} 2.5s infinite`,
    //   pointerEvents: "none",
    //   zIndex: 1,
    //   borderRadius: tokens.radius.md,
    //   overflow: "hidden"
    // }
  })
}));

export const Avatar = styled("div", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "active",
})(({ color, active }) => ({
  width: "clamp(32px, 8vw, 48px)",
  height: "clamp(32px, 8vw, 48px)",
  borderRadius: "50%",
  backgroundColor: color === "red" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 221, 0, 0.15)",
  border: `2px solid ${color === "red" ? "#ef4444" : "#ffdd00"}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "clamp(16px, 4vw, 24px)",
  animation: active 
    ? `${color === "red" ? avatarPulseRed : avatarPulseYellow} 1.5s infinite ease-in-out` 
    : "none",
}));

export const PlayerName = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  fontSize: "clamp(12px, 3vw, 16px)",
  fontWeight: active ? 700 : 600,
  color: active ? "#ffffff" : tokens.colors.text,
  textAlign: "center",
  maxWidth: "120px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: tokens.transition,
  textShadow: active ? "0 0 8px rgba(255,255,255,0.4)" : "none",
}));

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
