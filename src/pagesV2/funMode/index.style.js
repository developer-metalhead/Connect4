import { styled } from "@mui/material/styles";
import { tokens } from "../../components/designSystem/tokens";

export const GameLayout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px", // Tightened for desktop
  width: "100%",
  maxWidth: "800px",
  margin: "auto",

  "@media (max-width: 768px)": {
    gap: "0px", 
    margin: "0 auto", // Anchor to top instead of centering vertically
  }
});

export const FeatureRow = styled("div")({
  display: "flex",
  gap: "12px",
  marginBottom: "16px",
  
  "@media (max-width: 768px)": {
    gap: "8px",
    marginBottom: "8px",
  }
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

  "@media (max-width: 768px)": {
    padding: "4px 10px",
    fontSize: "10px",
  }
}));

export const InstructionCard = styled("div")({
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  padding: "16px",
  width: "100%",
  maxWidth: "600px",
  marginTop: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: tokens.shadows.lg,

  "@media (max-width: 768px)": {
    display: "none", // Hide instructions on small screens to save space
  }
});

export const InstructionSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  "& h3": { fontSize: "14px", margin: 0 },
  "& p": { fontSize: "12px", opacity: 0.8, margin: 0 },
});

export const FunModeBoardWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isUpsideDown",
})(({ isUpsideDown }) => ({
  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: isUpsideDown ? "rotate(180deg)" : "rotate(0deg)",
  position: "relative",
}));

export const ControlGroup = styled("div")({
  display: "flex",
  gap: "12px",
  marginTop: "16px",
  width: "100%",
  maxWidth: "320px",
  justifyContent: "center",
  
  "@media (max-width: 768px)": {
    marginTop: "8px",
  }
});
