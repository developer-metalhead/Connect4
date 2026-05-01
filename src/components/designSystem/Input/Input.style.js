import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const InputGroup = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
});

export const Label = styled("label")({
  fontSize: "13px",
  fontWeight: 600,
  color: tokens.colors.textMuted,
  paddingLeft: "4px",
});

export const InputWrapper = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
});

export const StyledInput = styled("input", {
  shouldForwardProp: (prop) => prop !== "hasIcon",
})(({ hasIcon }) => ({
  width: "100%",
  padding: `12px ${hasIcon ? "40px" : "16px"}`,
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  border: `1px solid ${tokens.colors.border}`,
  borderRadius: tokens.radius.md,
  color: tokens.colors.text,
  fontSize: "15px",
  fontFamily: "inherit",
  transition: tokens.transition,
  outline: "none",
  
  "&::placeholder": {
    color: tokens.colors.textDim,
  },
  
  "&:hover": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  
  "&:focus": {
    borderColor: tokens.colors.primary,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    boxShadow: `0 0 0 4px rgba(59, 130, 246, 0.1)`,
  },
  
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  }
}));

export const HelperText = styled("p", {
  shouldForwardProp: (prop) => prop !== "error",
})(({ error }) => ({
  margin: 0,
  fontSize: "12px",
  paddingLeft: "4px",
  color: error ? tokens.colors.danger : tokens.colors.textDim,
}));

export const InputIcon = styled("div")({
  position: "absolute",
  left: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: tokens.colors.textDim,
  pointerEvents: "none",
});
