import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const StyledButton = styled("button", {
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth'].includes(prop),
})(({ variant = "primary", size = "md", fullWidth = false }) => {
  
  // Base Styles
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: tokens.radius.md,
    fontWeight: tokens.fonts.weight,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: tokens.transition,
    border: "1px solid transparent",
    width: fullWidth ? "100%" : "auto",
    userSelect: "none",
    outline: "none",
    whiteSpace: "nowrap",
    textDecoration: "none",
    
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    
    "&:active": {
      transform: "scale(0.96)",
    },
  };

  // Size Variants
  const sizeStyles = {
    sm: { padding: "8px 16px", fontSize: "13px" },
    md: { padding: "12px 24px", fontSize: "14px" },
    lg: { padding: "16px 32px", fontSize: "16px" },
  }[size];

  // Color Variants
  const variantStyles = {
    primary: {
      backgroundColor: tokens.colors.primary,
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
      "&:hover": { 
        backgroundColor: tokens.colors.primaryHover,
        transform: "translateY(-1px)",
        boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
      },
    },
    secondary: {
      backgroundColor: tokens.colors.secondary,
      color: tokens.colors.text,
      border: "1px solid rgba(255, 255, 255, 0.1)",
      "&:hover": { 
        backgroundColor: tokens.colors.secondaryHover,
        transform: "translateY(-1px)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
    },
    outline: {
      backgroundColor: "transparent",
      color: tokens.colors.text,
      border: "1px solid rgba(255, 255, 255, 0.2)",
      "&:hover": { 
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        transform: "translateY(-1px)",
      },
    },
    ghost: {
      backgroundColor: "transparent",
      color: tokens.colors.textMuted,
      "&:hover": { 
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: tokens.colors.text,
      },
    },
    danger: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: tokens.colors.danger,
      border: "1px solid rgba(239, 68, 68, 0.2)",
      "&:hover": { 
        backgroundColor: tokens.colors.danger,
        color: "#ffffff",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
      },
    },
  }[variant];

  return { ...baseStyles, ...sizeStyles, ...variantStyles };
});
