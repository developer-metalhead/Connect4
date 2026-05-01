import React, { useState, useRef, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "./tokens";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const MenuWrapper = styled("div")({
  position: "fixed",
  top: "12px",
  right: "12px",
  zIndex: 1500,

  "@media (max-width: 768px)": {
    top: "8px",
    right: "8px",
    borderRadius: "8px",

  },
});

const MenuButton = styled("button")(({ active }) => ({
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: active ? "rgba(255, 255, 255, 0.15)" : tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#fff",
  display: "flex",
  flexDirection: "column", // Keep column for rotation logic
  alignItems: "center",
  justifyContent: "center",
  gap: "3.5px",
  cursor: "pointer",
  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)", // Slower, smoother easing
  transform: active ? "rotate(90deg)" : "rotate(0deg)", // Rotate the whole group
  padding: 0,
  outline: "none",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    transform: active ? "rotate(90deg) scale(1.1)" : "scale(1.1)",
  },

  "@media (max-width: 768px)": {
    borderRadius: "8px",
  },

  "& span": {
    width: "4px",
    height: "4px",
    background: "#fff",
    borderRadius: "50%",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  },
}));

const Dropdown = styled("div")({
  position: "absolute",
  top: "60px",
  right: 0,
  width: "220px",
  background: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  boxShadow: tokens.shadows.lg,
  padding: "8px",
  animation: `${fadeIn} 0.2s ease-out forwards`,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const MenuItem = styled("button")(({ active }) => ({
  width: "100%",
  padding: "12px 16px",
  borderRadius: tokens.radius.md,
  border: "none",
  background: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
  color: active ? tokens.colors.primary : "rgba(255, 255, 255, 0.8)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  transition: "all 0.2s",
  fontSize: "14px",
  fontWeight: 500,
  textAlign: "left",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
  },

  "& svg": {
    width: "18px",
    height: "18px",
    opacity: 0.7,
  },
}));

const SettingsMenu = ({ options, activeOption, onOptionClick, soundManager }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (soundManager) soundManager.playHoverSound();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (id) => {
    if (soundManager) soundManager.playHoverSound();
    onOptionClick(id);
    setIsOpen(false);
  };

  return (
    <MenuWrapper ref={menuRef}>
      <MenuButton active={isOpen} onClick={handleToggle} aria-label="Settings">
        <span></span>
        <span></span>
        <span></span>
      </MenuButton>

      {isOpen && (
        <Dropdown>
          {options.map((option) => (
            <MenuItem
              key={option.id}
              active={activeOption === option.id}
              onClick={() => handleItemClick(option.id)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </Dropdown>
      )}
    </MenuWrapper>
  );
};

export default SettingsMenu;
