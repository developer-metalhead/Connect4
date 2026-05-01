import React from "react";
import { StyledButton } from "./Button.style";

/**
 * Generic Premium Button Component
 * @param {Object} props
 * @param {string} [props.variant='primary'] - primary, secondary, outline, ghost, danger
 * @param {string} [props.size='md'] - sm, md, lg
 * @param {boolean} [props.fullWidth=false]
 * @param {React.ReactNode} [props.icon] - Optional icon component
 * @param {Object} [props.soundManager] - Sound manager for click effects
 */
const Button = ({ 
  children, 
  onClick, 
  soundManager, 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  icon: Icon,
  ...props 
}) => {
  const handleClick = (e) => {
    // Play global click sound if available
    if (soundManager?.playClickSound) {
      soundManager.playClickSound();
    }
    if (onClick) onClick(e);
  };

  return (
    <StyledButton 
      onClick={handleClick} 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      {...props}
    >
      {Icon && Icon}
      {children}
    </StyledButton>
  );
};

export default Button;
