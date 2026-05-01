import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const SettingsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
});

export const FeatureCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: tokens.radius.lg,
  padding: "20px",
  border: `1px solid ${active ? tokens.colors.primaryLight : tokens.colors.borderLight}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  position: "relative",
  overflow: "hidden",
  
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    transform: "translateY(-2px)",
    boxShadow: tokens.shadows.md,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    backgroundColor: active ? tokens.colors.primary : "transparent",
    transition: "background-color 0.3s ease",
  }
}));

export const CardHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const TitleGroup = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const FeatureTitle = styled("h4")({
  margin: 0,
  fontSize: "16px",
  fontWeight: 700,
  color: tokens.colors.text,
});

export const FeatureDescription = styled("p")({
  margin: 0,
  fontSize: "13px",
  color: tokens.colors.textMuted,
  lineHeight: 1.5,
});

export const SwitchWrapper = styled("label")({
  position: "relative",
  display: "inline-block",
  width: "50px",
  height: "26px",
  flexShrink: 0,
});

export const SwitchInput = styled("input")({
  opacity: 0,
  width: 0,
  height: 0,
});

export const SwitchSlider = styled("span", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: active ? tokens.colors.primary : "rgba(255,255,255,0.1)",
  transition: "0.4s",
  borderRadius: "34px",
  
  "&::before": {
    position: "absolute",
    content: '""',
    height: "18px",
    width: "18px",
    left: active ? "28px" : "4px",
    bottom: "4px",
    backgroundColor: "white",
    transition: "0.4s",
    borderRadius: "50%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  }
}));
