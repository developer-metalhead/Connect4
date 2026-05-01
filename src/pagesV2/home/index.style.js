import { styled } from "@mui/material/styles";
import { tokens } from "../../components/designSystem/tokens";

export const HomeHeader = styled("h1")({
  fontSize: "clamp(48px, 10vw, 80px)",
  fontWeight: 900,
  letterSpacing: "-3px",
  margin: 0,
  background: "linear-gradient(to bottom, #ffffff 30%, #94a3b8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  lineHeight: 1,
});

export const HomeSubtitle = styled("p")({
  fontSize: "clamp(16px, 4vw, 20px)",
  color: tokens.colors.textMuted,
  margin: "12px 0 48px 0",
  textAlign: "center",
  maxWidth: "400px",
});

export const MenuGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  width: "100%",
  maxWidth: "320px",
});

export const Decoration = styled("div")({
  position: "absolute",
  width: "300px",
  height: "300px",
  background: tokens.colors.primary,
  filter: "blur(150px)",
  opacity: 0.1,
  borderRadius: "50%",
  zIndex: -1,
  pointerEvents: "none",
});
