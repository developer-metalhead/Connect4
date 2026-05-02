import React from "react";
import { 
  StatusPill, 
  OverlayBackdrop, 
  ResultCard,
  ResultIcon,
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
  secondaryActionLabel = "Main Menu",
  variant = "win", // win, loss, draw, default
  icon,
  soundManager,
  isNaturalEnding = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(!isNaturalEnding);

  React.useEffect(() => {
    if (isNaturalEnding) {
      const timer = setTimeout(() => setIsVisible(true), 1000); // 1.5s gap for natural win
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isNaturalEnding]);

  if (!isVisible) return null;

  return (
    <OverlayBackdrop>
      <ResultCard>
        <ResultIcon variant={variant}>
          {icon || (variant === "win" ? "🏆" : variant === "loss" ? "😔" : "🤝")}
        </ResultIcon>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <OverlayTitle variant={variant}>{title}</OverlayTitle>
          {subtitle && <OverlaySubtitle>{subtitle}</OverlaySubtitle>}
        </div>
        
        <ActionGroup>
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            onClick={onPrimaryAction}
            soundManager={soundManager}
          >
            {primaryActionLabel}
          </Button>
          {onSecondaryAction && (
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth
              onClick={onSecondaryAction}
              soundManager={soundManager}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </ActionGroup>
      </ResultCard>
    </OverlayBackdrop>
  );
};
