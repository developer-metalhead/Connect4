import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { tokens } from "./tokens";

const BackButtonWrapper = styled("button")({
  position: "fixed",
  top: "12px",
  left: "12px",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1000,
  boxShadow: tokens.shadows.md,
  padding: 0,

  "@media (max-width: 768px)": {
    top: "4px",
    left: "8px",
    borderRadius: "8px",
  },

  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
    transform: "translateX(-4px)",
    boxShadow: tokens.shadows.lg,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  "&:active": {
    transform: "scale(0.95) translateX(-2px)",
  },

  "& svg": {
    width: "24px",
    height: "24px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

const BackButton = ({ onClick, soundManager }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (soundManager) {
      soundManager.playHoverSound(); // Using hover sound for button feedback
    }
    
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <BackButtonWrapper onClick={handleClick} aria-label="Go back">
      <svg viewBox="0 0 24 24">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </BackButtonWrapper>
  );
};

export default BackButton;
