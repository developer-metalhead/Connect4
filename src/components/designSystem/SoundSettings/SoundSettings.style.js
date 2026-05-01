import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const SettingsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
});

export const SettingRow = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const LabelGroup = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const Label = styled("label")({
  fontSize: "14px",
  fontWeight: 600,
  color: tokens.colors.text,
});

export const VolumeDisplay = styled("span")({
  fontSize: "12px",
  fontWeight: 700,
  color: tokens.colors.primary,
  fontFamily: "monospace",
});

export const Slider = styled("input")({
  WebkitAppearance: "none",
  width: "100%",
  height: "6px",
  borderRadius: "3px",
  background: tokens.colors.surfaceLight,
  outline: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:disabled": {
    opacity: 0.3,
    cursor: "not-allowed",
  },

  "&::-webkit-slider-thumb": {
    WebkitAppearance: "none",
    appearance: "none",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: tokens.colors.primary,
    border: `3px solid ${tokens.colors.background}`,
    boxShadow: tokens.shadows.sm,
    transition: "all 0.2s ease",
    
    "&:hover": {
      transform: "scale(1.2)",
      boxShadow: `0 0 10px ${tokens.colors.primary}`,
    }
  },

  "&::-moz-range-thumb": {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: tokens.colors.primary,
    border: `3px solid ${tokens.colors.background}`,
    boxShadow: tokens.shadows.sm,
    cursor: "pointer",
    transition: "all 0.2s ease",
    
    "&:hover": {
      transform: "scale(1.2)",
      boxShadow: `0 0 10px ${tokens.colors.primary}`,
    }
  }
});

export const ToggleGroup = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: tokens.radius.md,
  border: `1px solid ${tokens.colors.borderLight}`,
});
