import React, { useEffect, useState, useRef } from 'react';
import { styled, keyframes } from '@mui/material/styles';

// CHANGE: Chaotic animations for party vibe
const partyBounce = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-2deg); }
  50% { transform: scale(1.2) rotate(2deg); }
  75% { transform: scale(1.1) rotate(-1deg); }
`;

const rainbowText = keyframes`
  0% { color: #ff0000; text-shadow: 0 0 20px #ff0000; }
  16% { color: #ff8000; text-shadow: 0 0 20px #ff8000; }
  33% { color: #ffff00; text-shadow: 0 0 20px #ffff00; }
  50% { color: #00ff00; text-shadow: 0 0 20px #00ff00; }
  66% { color: #0080ff; text-shadow: 0 0 20px #0080ff; }
  83% { color: #8000ff; text-shadow: 0 0 20px #8000ff; }
  100% { color: #ff0000; text-shadow: 0 0 20px #ff0000; }
`;

const iconSpin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.2); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

const slideInExplode = keyframes`
  0% { 
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% { 
    transform: scale(1.3) rotate(0deg);
    opacity: 1;
  }
  100% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

// CHANGE: Fullscreen chaotic overlay
const OverlayContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(45deg, #ff1744, #ff9800, #ffeb3b, #4caf50, #2196f3, #9c27b0)',
  backgroundSize: '400% 400%',
  animation: `${partyBounce} 0.5s ease-in-out infinite`,
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  overflow: 'hidden',
});

// CHANGE: Big bold title with rainbow animation
const MainTitle = styled('h1')({
  fontSize: 'clamp(48px, 12vw, 120px)',
  fontWeight: '900',
  textAlign: 'center',
  margin: '20px 0',
  fontFamily: 'Impact, Arial Black, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '4px',
  animation: `${rainbowText} 1s linear infinite, ${slideInExplode} 0.8s ease-out`,
  textStroke: '3px #000',
  WebkitTextStroke: '3px #000',
  filter: 'drop-shadow(5px 5px 0px #000)',
});

// CHANGE: Icon container with spinning animations
const IconContainer = styled('div')({
  display: 'flex',
  gap: '30px',
  margin: '20px 0',
  fontSize: 'clamp(60px, 8vw, 100px)',
  
  '& span': {
    animation: `${iconSpin} 2s linear infinite`,
    filter: 'drop-shadow(3px 3px 0px #000)',
  },
  
  '& span:nth-of-type(1)': { animationDelay: '0s' },
  '& span:nth-of-type(2)': { animationDelay: '0.3s' },
  '& span:nth-of-type(3)': { animationDelay: '0.6s' },
});

// CHANGE: Taunt text with party styling
const TauntText = styled('p')({
  fontSize: 'clamp(24px, 4vw, 36px)',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '20px 40px',
  color: '#fff',
  textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
  fontFamily: 'Arial Black, sans-serif',
  animation: `${partyBounce} 1s ease-in-out infinite`,
  maxWidth: '800px',
});

// CHANGE: Dismiss instruction
const DismissText = styled('div')({
  position: 'absolute',
  bottom: '40px',
  fontSize: '18px',
  color: '#fff',
  textShadow: '2px 2px 0px #000',
  fontWeight: 'bold',
  animation: `${partyBounce} 2s ease-in-out infinite`,
});

// CHANGE: Array of funny/mean taunt voice lines
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
  "RESET BUTTON GO BRRRRR 🔄💥",
  "Skill issue detected! 🚨🤡",
  "Time for a fresh start, kiddo! 👶"
];

const PostVideoOverlay = ({ isVisible, onClose, soundManager }) => {
  const [tauntLine, setTauntLine] = useState('');
  // CHANGE: Remove soundPlayingRef as it's now handled by soundManager
  
  // CHANGE: Simplified close handler that uses soundManager.stopSound
  const handleClose = () => {
    if (soundManager) {
      soundManager.stopSound('monkeylaugh');
    }
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      // CHANGE: Pick random taunt line when overlay shows
      const randomTaunt = TAUNT_LINES[Math.floor(Math.random() * TAUNT_LINES.length)];
      setTauntLine(randomTaunt);
      
      // CHANGE: Play monkey laugh sound
      if (soundManager) {
        soundManager.playSound('monkeylaugh');
      }
      
      // CHANGE: Auto-dismiss after 4.5 seconds with sound cleanup
      const timer = setTimeout(() => {
        handleClose();
      }, 2500);
      
      return () => {
        clearTimeout(timer);
        // CHANGE: Stop sound when component unmounts or visibility changes
        if (soundManager) {
          soundManager.stopSound('monkeylaugh');
        }
      };
    } else {
      // CHANGE: Stop sound when overlay becomes invisible
      if (soundManager) {
        soundManager.stopSound('monkeylaugh');
      }
    }
  }, [isVisible, onClose, soundManager]);

  if (!isVisible) return null;

  return (
    <OverlayContainer onClick={handleClose}>
      <MainTitle>
        YOU LOSE BOZO
      </MainTitle>
      
      <IconContainer>
        <span>🍾</span>
        <span>🐒</span>
        <span>🍺</span>
      </IconContainer>
      
      <TauntText>
        {tauntLine}
      </TauntText>
      
      <DismissText>
        Click anywhere to dismiss
      </DismissText>
    </OverlayContainer>
  );
};

export default PostVideoOverlay;