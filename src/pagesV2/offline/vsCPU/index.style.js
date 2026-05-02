import { styled } from "@mui/material/styles";
import { tokens } from "../../../components/designSystem/tokens";

export const GameLayout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  paddingBottom: "40px",

  "@media (max-width: 768px)": {
    gap: "8px", 
    paddingBottom: "20px",
  },
  
  "@media (max-height: 800px)": {
    gap: "6px",
  }
});

export const ControlGroup = styled("div")({
  display: "flex",
  gap: "12px",
  marginTop: "16px",
  width: "100%",
  maxWidth: "320px",
  justifyContent: "center",
  
  "@media (max-width: 768px)": {
    marginTop: "8px",
    maxWidth: "280px",
  }
});

export const DifficultyContainer = styled("div")({
  position: "relative",
  display: "flex",
  background: "rgba(10, 15, 25, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: tokens.radius.full,
  padding: "6px",
  gap: "0",
  marginTop: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
  width: "fit-content",

  "@media (max-width: 768px)": {
    marginTop: "16px",
    padding: "5px",
  }
});

export const SlidingPill = styled("div", {
  shouldForwardProp: (prop) => prop !== "activeIndex",
})(({ activeIndex }) => ({
  position: "absolute",
  top: "6px",
  left: "6px",
  width: "calc(33.33% - 4px)",
  height: "calc(100% - 12px)",
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #4facfe 100%)`,
  borderRadius: tokens.radius.full,
  transform: `translateX(${activeIndex * 100}%)`,
  transition: "all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
  boxShadow: `0 0 15px ${tokens.colors.primary}44`,
  zIndex: 1,

  "@media (max-width: 768px)": {
    top: "5px",
    left: "5px",
    height: "calc(100% - 10px)",
  }
}));

export const DifficultyButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  position: "relative",
  background: "transparent",
  color: active ? "#fff" : "rgba(255, 255, 255, 0.5)",
  border: "none",
  borderRadius: tokens.radius.full,
  padding: "12px 32px", // Increased from 8px 16px
  fontSize: "14px", // Increased from 11px
  fontWeight: active ? 700 : 600,
  cursor: "pointer",
  transition: "color 0.3s ease",
  textTransform: "uppercase",
  letterSpacing: "1.2px",
  zIndex: 2,
  minWidth: "120px", // Increased from 80px
  outline: "none",

  "&:hover": {
    color: "#fff",
  },
  
  "@media (max-width: 768px)": {
    padding: "10px 20px",
    minWidth: "90px",
    fontSize: "12px",
  }
}));