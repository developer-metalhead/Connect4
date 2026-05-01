import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";




const slideIn = keyframes`
  0% { transform: translate(-50%, -150%) scale(0.8); opacity: 0; }
  20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  30% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, 50%) scale(0.9); opacity: 0; }
`;

const flyAway = keyframes`
  0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0.5) rotate(var(--rot)); opacity: 0; }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  border: 3px solid ${(props) => (props.type === "monkey" ? "#FFC107" : "#FF5722")};
  box-shadow: 0 0 20px ${(props) => (props.type === "monkey" ? "#FFC107" : "#FF5722")};
  color: #fff;
  border-radius: 20px;
  padding: 20px 40px;
  text-align: center;
  z-index: 9999;
  animation: ${slideIn} 2.5s ease-in-out forwards;
  pointer-events: none;
`;

const Emojis = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Text = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
`;

const Particle = styled.div`
  position: absolute;
  font-size: ${(props) => props.size}px;
  top: 50%;
  left: 50%;
  --x: ${(props) => props.destX}px;
  --y: ${(props) => props.destY}px;
  --rot: ${(props) => props.rot}deg;
  animation: ${flyAway} ${(props) => props.duration}ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: ${(props) => props.delay}ms;
  opacity: 0;
`;

// === MONKEY MAYHEM / ROOSTER OF RAGE OVERLAY ===
const RemovalOverlay = ({ data, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!data) return;

    // Generate random flying disc particles
    const newParticles = [];

    
    for (let i = 0; i < (data.count || 1) * 3; i++) {
        newParticles.push({
            id: i,
            disc: data.player || "⚪",
    
            size:  Math.random() * 40 + 70,
            destX: (Math.random() - 0.5) * 400,
            destY: (Math.random() - 0.5) * 400,
            rot: Math.random() * 360,
            delay: Math.random() * 400,
        
            duration: 1600
        });
    }
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 65000);

    return () => clearTimeout(timer);
  }, [data, onComplete]);

  if (!data) return null;

  return (
    <OverlayContainer type={data.type}>
      <Emojis>
        {data.type === "monkey" ? "🐒" : "🔥🐓"}
      </Emojis>
      <Text>
        {data.type === "monkey"
          ? `Monkey stole ${data.player} disc from ${data.row} row ${data.col} col!`
          : `Rooster of Rage gawked at ${data.count} ${data.player}  disc(s) from row ${data.row}!`}
      </Text>
      
      {particles.map((p) => (
        <Particle
          key={p.id}
          size={p.size}
          destX={p.destX}
          destY={p.destY}
          rot={p.rot}
          delay={p.delay}
          duration={p.duration}
        >
          {p.disc}
        </Particle>
      ))}
    </OverlayContainer>
  );
};

export default RemovalOverlay;
