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
  marginTop: "12px", // Reduced from 24px
  transition: tokens.transition,
  
  "@media (max-width: 768px)": {
    marginTop: "4px",
    padding: "6px 16px",
    fontSize: "13px",
  },
  
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
  backgroundColor: "rgba(2, 6, 23, 0.85)",
  backdropFilter: "blur(12px)",
  zIndex: 3000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "overlayFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  
  "@keyframes overlayFadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  }
});

export const ResultCard = styled("div")({
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.xl,
  padding: "48px",
  width: "90%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  animation: "cardSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",

  "@keyframes cardSlideUp": {
    from: { opacity: 0, transform: "translateY(40px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
  }
});

export const ResultIcon = styled("div", {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ variant }) => ({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  background: variant === "win" ? "rgba(34, 197, 94, 0.15)" : variant === "loss" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.1)",
  color: variant === "win" ? "#22c55e" : variant === "loss" ? "#ef4444" : "#94a3b8",
  border: `2px solid ${variant === "win" ? "rgba(34, 197, 94, 0.3)" : variant === "loss" ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.2)"}`,
  boxShadow: `0 0 20px ${variant === "win" ? "rgba(34, 197, 94, 0.2)" : variant === "loss" ? "rgba(239, 68, 68, 0.2)" : "transparent"}`,
}));

export const OverlayTitle = styled("h2", {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ variant }) => ({
  fontSize: "48px",
  fontWeight: 800,
  margin: 0,
  textAlign: "center",
  letterSpacing: "-1px",
  background: variant === "win" ? "linear-gradient(to bottom, #fff, #22c55e)" : variant === "loss" ? "linear-gradient(to bottom, #fff, #ef4444)" : "linear-gradient(to bottom, #fff, #94a3b8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  
  "@media (max-width: 600px)": {
    fontSize: "36px",
  }
}));

export const OverlaySubtitle = styled("p")({
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.6)",
  margin: "-20px 0 0 0",
  textAlign: "center",
  maxWidth: "300px",
  lineHeight: 1.6,
});

export const ActionGroup = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "12px",
  marginTop: "8px",
});

