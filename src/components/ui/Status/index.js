import React from "react";
import { 
  StatusPill, 
  OverlayBackdrop, 
  OverlayTitle, 
  OverlaySubtitle, 
  ActionGroup 
} from "./Status.style";
import Button from "../Button";

/**
 * Current Turn / Game State Indicator
 */
export const GameStatus = ({ message, currentPlayerColor }) => (
  <StatusPill color={currentPlayerColor}>
    {message}
  </StatusPill>
);

/**
 * Full-screen Match Result Overlay
 */
export const MatchResultOverlay = ({ 
  title, 
  subtitle, 
  onPrimaryAction, 
  primaryActionLabel = "Play Again",
  onSecondaryAction,
  secondaryActionLabel = "Back to Menu",
  variant = "win", // win, draw, default
  soundManager
}) => {
  return (
    <OverlayBackdrop>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <OverlayTitle variant={variant}>{title}</OverlayTitle>
        {subtitle && <OverlaySubtitle>{subtitle}</OverlaySubtitle>}
      </div>
      
      <ActionGroup>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onPrimaryAction}
          soundManager={soundManager}
        >
          {primaryActionLabel}
        </Button>
        {onSecondaryAction && (
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onSecondaryAction}
            soundManager={soundManager}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </ActionGroup>
    </OverlayBackdrop>
  );
};
