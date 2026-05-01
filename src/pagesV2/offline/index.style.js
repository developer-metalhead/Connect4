import { styled } from "@mui/material/styles";
import { tokens } from "../../components/designSystem/tokens";

export const OfflineHeader = styled("h1")({
  fontSize: "clamp(32px, 8vw, 48px)",
  fontWeight: 800,
  letterSpacing: "-1px",
  margin: 0,
  color: tokens.colors.text,
  textAlign: "center",
});

export const OfflineSubtitle = styled("p")({
  fontSize: "16px",
  color: tokens.colors.textMuted,
  margin: "8px 0 32px 0",
  textAlign: "center",
});

export const SelectionGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  width: "100%",
  maxWidth: "320px",
});
