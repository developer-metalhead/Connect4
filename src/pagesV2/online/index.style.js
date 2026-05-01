import { styled } from "@mui/material/styles";
import { tokens } from "../../components/designSystem/tokens";

export const GameLayout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
});

export const LobbyCard = styled("div")({
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  padding: "32px",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  boxShadow: tokens.shadows.xl,
});

export const RoomBadge = styled("div")({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: tokens.radius.full,
  fontSize: "12px",
  fontWeight: 600,
  color: tokens.colors.textMuted,
  border: `1px solid ${tokens.colors.borderLight}`,
});

export const InviteSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: tokens.radius.md,
  border: `1px solid ${tokens.colors.borderLight}`,
});

export const SectionTitle = styled("h3")({
  fontSize: "14px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: tokens.colors.textDim,
  margin: 0,
});