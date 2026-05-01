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

export const FeatureRow = styled("div")({
  display: "flex",
  gap: "12px",
  marginBottom: "16px",
});

export const FeatureBadge = styled("div", {
  shouldForwardProp: (prop) => prop !== "enabled",
})(({ enabled }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 14px",
  backgroundColor: enabled ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
  border: `1px solid ${enabled ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
  borderRadius: tokens.radius.full,
  fontSize: "12px",
  fontWeight: 700,
  color: enabled ? tokens.colors.success : tokens.colors.danger,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

export const InstructionCard = styled("div")({
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  padding: "24px",
  width: "100%",
  maxWidth: "600px",
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  boxShadow: tokens.shadows.lg,
});

export const InstructionSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const FunModeBoardWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isUpsideDown",
})(({ isUpsideDown }) => ({
  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: isUpsideDown ? "rotate(180deg)" : "rotate(0deg)",
}));

export const ControlGroup = styled("div")({
  display: "flex",
  gap: "12px",
  marginTop: "16px",
  width: "100%",
  maxWidth: "320px",
  justifyContent: "center",
});
