import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { tokens } from "../../tokens";
import Button from '../../Button';

// Animations
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(234, 179, 8, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
`;

const slideUp = keyframes`
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

// Styles
const ButtonContainer = styled('div')({
  position: 'fixed',
  top: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10002,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

const SpecialMonkeyButton = styled('button')({
  background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
  border: 'none',
  borderRadius: tokens.radius.xl,
  padding: '24px 48px',
  fontSize: '32px',
  fontWeight: 900,
  color: '#000',
  cursor: 'pointer',
  boxShadow: '0 20px 40px rgba(202, 138, 4, 0.4)',
  animation: `${shake} 0.2s infinite, ${pulse} 2s infinite`,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  '&:hover': {
    transform: 'scale(1.1) translateY(-5px)',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  }
});

const TimerBadge = styled('div')({
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(8px)',
  color: tokens.colors.primary,
  padding: '8px 20px',
  borderRadius: tokens.radius.full,
  fontSize: '14px',
  fontWeight: 800,
  border: `1px solid ${tokens.colors.primary}`,
  boxShadow: tokens.shadows.md,
});

const StatusIndicator = styled('div')({
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: `1px solid ${tokens.colors.primary}`,
  padding: '12px 24px',
  borderRadius: tokens.radius.full,
  color: tokens.colors.primary,
  fontSize: '14px',
  fontWeight: 800,
  zIndex: 1000,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  animation: `${slideUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  boxShadow: tokens.shadows.lg,
});

const MonkeyModeOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(234, 179, 8, 0.05)',
  border: '8px solid rgba(234, 179, 8, 0.2)',
  zIndex: 10001,
  pointerEvents: 'none',
  animation: 'pulseBorder 2s infinite alternate',
  '@keyframes pulseBorder': {
    from: { opacity: 0.3 },
    to: { opacity: 0.8 }
  }
});

// Components
export const MonkeyButtonSection = ({ 
  showMonkeyButton, 
  onTrigger, 
  timeLeft 
}) => {
  if (!showMonkeyButton) return null;

  return (
    <>
      <MonkeyModeOverlay />
      <ButtonContainer>
        <SpecialMonkeyButton onClick={onTrigger}>
          MONKEY FLIP! 🐒
        </SpecialMonkeyButton>
        <TimerBadge>{timeLeft}s REMAINING</TimerBadge>
      </ButtonContainer>
    </>
  );
};

export const GravityStatusSection = ({ 
  isGravityFalling, 
  isUpsideDown, 
  upsideDownTurnsLeft 
}) => {
  if (isGravityFalling) {
    return (
      <StatusIndicator>
        🌊 GRAVITY RESTORED! 🌊
      </StatusIndicator>
    );
  }

  if (isUpsideDown && !isGravityFalling) {
    return (
      <StatusIndicator>
        🙃 UPSIDE DOWN ({Math.ceil(upsideDownTurnsLeft / 2)} turns left)
      </StatusIndicator>
    );
  }

  return null;
};

export const MonkeyModeContainer = ({ 
  monkeyModeEnabled,
  showMonkeyButton,
  monkeyButtonTimer,
  handleMonkeyButtonClick,
  isGravityFalling,
  isUpsideDown,
  upsideDownTurnsLeft
}) => {
  if (!monkeyModeEnabled) return null;

  return (
    <>
      <MonkeyButtonSection
        showMonkeyButton={showMonkeyButton}
        onTrigger={handleMonkeyButtonClick}
        timeLeft={monkeyButtonTimer}
      />
      
      <GravityStatusSection
        isGravityFalling={isGravityFalling}
        isUpsideDown={isUpsideDown}
        upsideDownTurnsLeft={upsideDownTurnsLeft}
      />
    </>
  );
};
