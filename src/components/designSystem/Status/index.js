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
import { EMOJIS } from "../../../logic/core/coreConfig";

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
  rematchState,
  myPlayerId,
}) => {
  console.log("🎨 MatchResultOverlay Render:", { title, hasRematchState: !!rematchState, myPlayerId });
  const [isVisible, setIsVisible] = React.useState(!isNaturalEnding);
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    if (isNaturalEnding) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isNaturalEnding]);

  // Countdown timer logic
  React.useEffect(() => {
    if (!rematchState?.expiresAt) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((rematchState.expiresAt - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rematchState?.expiresAt]);

  if (!isVisible) return null;

  const hasRequested = rematchState?.requestedBy?.includes(myPlayerId);
  const isDeclined = rematchState?.isDeclined && isNaturalEnding; // Only show decline if rematch was possible
  
  let dynamicPrimaryLabel = primaryActionLabel;
  let isPrimaryDisabled = false;

  if (rematchState?.expiresAt) {
    if (hasRequested) {
      dynamicPrimaryLabel = `Waiting (${timeLeft})`;
      isPrimaryDisabled = true;
    } else {
      dynamicPrimaryLabel = `Rematch (${timeLeft})`;
    }
  } else if (hasRequested) {
    dynamicPrimaryLabel = "Waiting...";
    isPrimaryDisabled = true;
  }
  
  if (isDeclined) {
    dynamicPrimaryLabel = "Opponent Left";
    isPrimaryDisabled = true;
  }

  return (
    <OverlayBackdrop>
      <ResultCard>
        <ResultIcon variant={variant}>
          {icon || (variant === "win" ? EMOJIS.WIN_CROWN || "🏆" : variant === "loss" ? EMOJIS.LOSS_SAD || "😔" : EMOJIS.DRAW_HANDSHAKE || "🤝")}
        </ResultIcon>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <OverlayTitle variant={variant}>{isDeclined ? "ROOM CLOSED" : title}</OverlayTitle>
          <OverlaySubtitle>
            {isDeclined ? (rematchState.declineReason || "The session has ended.") : subtitle}
          </OverlaySubtitle>
        </div>
        
        <ActionGroup>
          {onPrimaryAction && primaryActionLabel && (
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={onPrimaryAction}
              soundManager={soundManager}
              disabled={isPrimaryDisabled}
            >
              {dynamicPrimaryLabel}
            </Button>
          )}
          {onSecondaryAction && (
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth
              onClick={() => {
                soundManager?.stopAllSounds();
                onSecondaryAction();
              }}
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
