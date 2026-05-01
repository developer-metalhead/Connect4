import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

export const ModalBackdrop = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(4px)",
  zIndex: 3000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px", // Slightly less padding to allow more space for content
  boxSizing: "border-box",
  animation: "modalFadeIn 0.3s ease-out",
  
  "@keyframes modalFadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  }
});

export const ModalContainer = styled("div")({
  width: "calc(100% - 48px)", // Safe margin for mobile
  maxWidth: "500px", 
  maxHeight: "90vh",
  backgroundColor: tokens.colors.surface,
  backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))",
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  boxShadow: tokens.shadows.xl,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "fixed", // Ensure it's positioned relative to viewport
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // Perfect centering
  animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  
  "@keyframes modalSlideUp": {
    from: { opacity: 0, transform: "translate(-50%, calc(-50% + 20px)) scale(0.95)" },
    to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  }
});

export const ModalHeader = styled("div")({
  padding: "20px 24px",
  borderBottom: `1px solid ${tokens.colors.borderLight}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const ModalTitle = styled("h3")({
  margin: 0,
  fontSize: "18px",
  fontWeight: 700,
  color: tokens.colors.text,
});

export const ModalBody = styled("div")({
  padding: "24px",
  fontSize: "15px",
  color: tokens.colors.textMuted,
  lineHeight: 1.6,
});

export const ModalFooter = styled("div")({
  padding: "16px 24px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderTop: `1px solid ${tokens.colors.borderLight}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "12px",
});
