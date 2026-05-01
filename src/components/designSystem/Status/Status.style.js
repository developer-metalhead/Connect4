import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

// 1. Status Indicator (The floating pill for current turn)
export const StatusPill = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})(({ color }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 20px",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.full,
  boxShadow: tokens.shadows.lg,
  color: tokens.colors.text,
  fontSize: "14px",
  fontWeight: 600,
  marginTop: "24px",
  transition: tokens.transition,
  
  "&::before": {
    content: '""',
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: color === "red" ? "#ef4444" : color === "yellow" ? "#ffdd00" : tokens.colors.textMuted,
    boxShadow: `0 0 8px ${color === "red" ? "rgba(239, 68, 68, 0.8)" : color === "yellow" ? "rgba(255, 221, 0, 0.8)" : "transparent"}`,
  }
}));

// 2. Game Over Overlay (Full screen celebration/defeat)
export const OverlayBackdrop = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(2, 6, 23, 0.9)",
  backdropFilter: "blur(8px)",
  zIndex: 2000,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "32px",
  animation: "overlayFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  
  "@keyframes overlayFadeIn": {
    from: { opacity: 0, backdropFilter: "blur(0px)" },
    to: { opacity: 1, backdropFilter: "blur(8px)" },
  }
});

export const OverlayTitle = styled("h2", {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ variant }) => ({
  fontSize: "64px",
  fontWeight: 900,
  margin: 0,
  textAlign: "center",
  letterSpacing: "-2px",
  color: variant === "win" ? tokens.colors.primary : variant === "draw" ? tokens.colors.textMuted : tokens.colors.text,
  textShadow: variant === "win" ? "0 0 40px rgba(59, 130, 246, 0.5)" : "none",
  
  "@media (max-width: 600px)": {
    fontSize: "40px",
  }
}));

export const OverlaySubtitle = styled("p")({
  fontSize: "18px",
  color: tokens.colors.textMuted,
  margin: "-16px 0 0 0",
  textAlign: "center",
});

export const ActionGroup = styled("div")({
  display: "flex",
  gap: "16px",
  marginTop: "16px",
});
