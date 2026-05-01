import React from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "./tokens";

const IconButton = styled("button")({
  position: "fixed",
  top: "11px",
  right: "24px",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "rgba(239, 68, 68, 0.2)", // Subtle red tint for give up
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1500,
  boxShadow: tokens.shadows.md,
  padding: 0,
  borderColor: "rgba(239, 68, 68, 0.4)",
  color: "#ef4444",


  "&:hover": {
    boxShadow: tokens.shadows.lg,
 

    color: "black",

  background: tokens.glass.background,
  borderColor: "black",

  },

  "&:active": {
    transform: "scale(0.95)",
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

const GiveUpButton = ({ onClick, soundManager }) => {
  const handleClick = () => {
    if (soundManager?.playClickSound) soundManager.playClickSound();
    if (onClick) onClick();
  };

  return (
    <IconButton onClick={handleClick} aria-label="Give up">
      <svg viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </IconButton>
  );
};

export default GiveUpButton;
