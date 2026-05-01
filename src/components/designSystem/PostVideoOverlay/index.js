import React, { useEffect, useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { tokens } from '../tokens';

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.4)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.6)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.4)); }
`;

const OverlayContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(2, 6, 23, 0.95)",
  backdropFilter: "blur(12px)",
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
  cursor: 'pointer',
  animation: "fadeIn 0.4s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  }
});

const ResultTitle = styled('h1')({
  fontSize: 'clamp(48px, 15vw, 96px)',
  fontWeight: 900,
  margin: 0,
  textAlign: 'center',
  letterSpacing: '-2px',
  background: "linear-gradient(to bottom, #ef4444, #991b1b)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 40px rgba(239, 68, 68, 0.3)",
  animation: `${slideUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
});

const IconGroup = styled('div')({
  display: 'flex',
  gap: '24px',
  fontSize: '64px',
  animation: `${pulse} 2s infinite ease-in-out`,
});

const TauntMessage = styled('p')({
  fontSize: 'clamp(18px, 4vw, 24px)',
  fontWeight: 600,
  color: tokens.colors.textMuted,
  textAlign: 'center',
  margin: 0,
  maxWidth: '600px',
  lineHeight: 1.6,
  animation: `${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
  animationDelay: '0.1s',
});

const DismissPrompt = styled('div')({
  position: 'absolute',
  bottom: '40px',
  fontSize: '14px',
  fontWeight: 700,
  color: tokens.colors.textDim,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  animation: "pulseOpacity 2s infinite",
  "@keyframes pulseOpacity": {
    "0%, 100%": { opacity: 0.3 },
    "50%": { opacity: 0.8 }
  }
});

const TAUNT_LINES = [
  "Better luck next time, loser! 🍌",
  "Git Gud bozo 😂",
  "Resetting your trash play 🐒",
  "Even a banana could play better! 🍌💀",
  "Time to start over, scrub! 🧽",
  "Your game skills = 🗑️ TRASH 🗑️",
  "Monkey brain > Your brain 🧠❌",
  "Back to square one, champ! 📦",
  "Maybe try tic-tac-toe instead? ❌⭕",
  "Skill issue detected! 🚨🤡",
  "Time for a fresh start, kiddo! 👶"
];

const PostVideoOverlay = ({ isVisible, onClose, soundManager }) => {
  const [tauntLine, setTauntLine] = useState('');

  const handleClose = () => {
    if (soundManager?.stopSound) {
      soundManager.stopSound('monkeylaugh');
    }
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      const randomTaunt = TAUNT_LINES[Math.floor(Math.random() * TAUNT_LINES.length)];
      setTauntLine(randomTaunt);
      
      if (soundManager?.playSound) {
        soundManager.playSound('monkeylaugh');
      }
      
      const timer = setTimeout(() => {
        handleClose();
      }, 3500);
      
      return () => {
        clearTimeout(timer);
        if (soundManager?.stopSound) {
          soundManager.stopSound('monkeylaugh');
        }
      };
    }
  }, [isVisible, soundManager]);

  if (!isVisible) return null;

  return (
    <OverlayContainer onClick={handleClose}>
      <ResultTitle>CPU WIN</ResultTitle>
      
      <IconGroup>
        <span>🤡</span>
        <span>🐒</span>
        <span>💀</span>
      </IconGroup>
      
      <TauntMessage>
        {tauntLine}
      </TauntMessage>
      
      <DismissPrompt>
        Click anywhere to skip
      </DismissPrompt>
    </OverlayContainer>
  );
};

export default PostVideoOverlay;
