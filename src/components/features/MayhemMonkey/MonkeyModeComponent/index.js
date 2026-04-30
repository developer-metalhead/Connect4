import React from 'react';
import MonkeyMayhemButton from '../MonkeyButton';
import MonkeyFlipAnimation from '../MonkeyAnimation';
import { MonkeyModeOverlay,UpsideDownIndicator } from './index.style';

// Monkey Mode Button with Debug Info
export const MonkeyModeButtonSection = ({ 
  showMonkeyButton, 
  monkeyButtonPlayer, 
  currentPlayer, 
  onTrigger, 
  timeLeft 
}) => {
  if (!showMonkeyButton) return null;

  return (
    <>
      <MonkeyModeOverlay />
      <div>
        <div
          style={{
            color: "white",
            fontSize: "12px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          DEBUG: Button for {monkeyButtonPlayer}, Current: {currentPlayer}
        </div>
        <MonkeyMayhemButton
          onTrigger={onTrigger}
          timeLeft={timeLeft}
        />
      </div>
    </>
  );
};

// Monkey Animation Component
export const MonkeyAnimationSection = ({ 
  isMonkeyAnimating, 
  monkeyVoiceLine 
}) => {
  return (
    <MonkeyFlipAnimation
      isAnimating={isMonkeyAnimating}
      voiceLine={monkeyVoiceLine}
      isFlippingBack={monkeyVoiceLine.includes("normal")}
    />
  );
};

// Gravity Status Indicators
export const GravityStatusSection = ({ 
  isGravityFalling, 
  isUpsideDown, 
  upsideDownTurnsLeft 
}) => {
  if (isGravityFalling) {
    return (
      <UpsideDownIndicator>
        🌊 GRAVITY RESTORED - Discs falling back! 🌊
      </UpsideDownIndicator>
    );
  }

  if (isUpsideDown && !isGravityFalling) {
    return (
      <UpsideDownIndicator>
        🙃 UPSIDE DOWN MODE - {Math.ceil(upsideDownTurnsLeft / 2)} turns left 🙃
      </UpsideDownIndicator>
    );
  }

  return null;
};

// Main Monkey Mode Container
export const MonkeyModeContainer = ({ 
  monkeyModeEnabled,
  showMonkeyButton,
  monkeyButtonPlayer,
  currentPlayer,
  monkeyButtonTimer,
  handleMonkeyButtonClick,
  isMonkeyAnimating,
  monkeyVoiceLine,
  isGravityFalling,
  isUpsideDown,
  upsideDownTurnsLeft
}) => {
  if (!monkeyModeEnabled) return null;

  return (
    <>
      <MonkeyModeButtonSection
        showMonkeyButton={showMonkeyButton}
        monkeyButtonPlayer={monkeyButtonPlayer}
        currentPlayer={currentPlayer}
        onTrigger={handleMonkeyButtonClick}
        timeLeft={monkeyButtonTimer}
      />
      
      <MonkeyAnimationSection
        isMonkeyAnimating={isMonkeyAnimating}
        monkeyVoiceLine={monkeyVoiceLine}
      />
      
      <GravityStatusSection
        isGravityFalling={isGravityFalling}
        isUpsideDown={isUpsideDown}
        upsideDownTurnsLeft={upsideDownTurnsLeft}
      />
    </>
  );
};