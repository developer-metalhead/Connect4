import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
`;

const banana = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-80px) rotate(180deg); opacity: 0; }
`;

const MonkeyButtonContainer = styled('div')({
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const MonkeyButton = styled('button')({
  background: 'linear-gradient(45deg, #ff6b35, #ffa500)',
  border: 'none',
  borderRadius: '20px',
  padding: '20px 40px',
  fontSize: '28px',
  fontWeight: 'bold',
  color: 'white',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)',
  animation: `${shake} 0.5s infinite`,
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 25px rgba(255, 107, 53, 0.6)',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  }
});

const MonkeyEmoji = styled('span')({
  fontSize: '40px',
  animation: `${bounce} 1s infinite`,
  display: 'inline-block',
  marginLeft: '10px',
});

const Timer = styled('div')({
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '16px',
  fontWeight: 'bold',
});

const ParticleContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

const Particle = styled('div')(({ type, delay }) => ({
  position: 'absolute',
  fontSize: type === 'banana' ? '20px' : '16px',
  animation: `${type === 'banana' ? banana : confetti} 2s infinite`,
  animationDelay: `${delay}s`,
  left: `${Math.random() * 100}%`,
  top: '100%',
}));

const MonkeyMayhemButton = ({ onTrigger, timeLeft }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        type: Math.random() > 0.3 ? 'confetti' : 'banana',
        delay: Math.random() * 2,
        char: Math.random() > 0.3 ? '🎉' : '🍌'
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <MonkeyButtonContainer>
      <MonkeyButton onClick={onTrigger}>
        MONKEY FLIP! 🔥
        <MonkeyEmoji>🐒</MonkeyEmoji>
      </MonkeyButton>
      <Timer>{timeLeft}s remaining</Timer>
      
      <ParticleContainer>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            type={particle.type}
            delay={particle.delay}
          >
            {particle.char}
          </Particle>
        ))}
      </ParticleContainer>
    </MonkeyButtonContainer>
  );
};

export default MonkeyMayhemButton;