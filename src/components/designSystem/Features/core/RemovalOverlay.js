import React, { useEffect, useState } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../tokens";
import { formatCoords,ROWS } from "../../../../helperFunction/helperFunction";

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

const OverlayContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "type",
})(({ type }) => ({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: `2px solid ${type === "monkey" ? "#FFC107" : "#FF5722"}`,
  boxShadow: `0 0 30px ${type === "monkey" ? "rgba(255, 193, 7, 0.3)" : "rgba(255, 87, 34, 0.3)"}`,
  color: "#fff",
  borderRadius: tokens.radius.xl,
  padding: "32px 48px",
  textAlign: "center",
  zIndex: 9999,
  animation: `${slideIn} 2.5s ease-in-out forwards`,
  pointerEvents: "none",
  minWidth: "320px",
}));

const Emojis = styled("div")({
  fontSize: "4rem",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
});

const Text = styled("p")({
  fontSize: "18px",
  fontWeight: 700,
  margin: 0,
  lineHeight: 1.5,
  color: tokens.colors.text,
  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
});

const Particle = styled("div", {
  shouldForwardProp: (prop) => !["size", "destX", "destY", "rot", "duration", "delay"].includes(prop),
})(({ size, destX, destY, rot, duration, delay }) => ({
  position: "absolute",
  fontSize: `${size}px`,
  top: "50%",
  left: "50%",
  "--x": `${destX}px`,
  "--y": `${destY}px`,
  "--rot": `${rot}deg`,
  animation: `${flyAway} ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
}));

const RemovalOverlay = ({ data, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!data) return;

    const newParticles = [];
    for (let i = 0; i < (data.count || 1) * 3; i++) {
      newParticles.push({
        id: i,
        disc: data.player || "⚪",
        size: Math.random() * 40 + 70,
        destX: (Math.random() - 0.5) * 600,
        destY: (Math.random() - 0.5) * 600,
        rot: Math.random() * 720,
        delay: Math.random() * 500,
        duration: 1800
      });
    }
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 2600);

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
          ? `Monkey stole ${data.player} disc from ${formatCoords(data.row, data.col)}!`
          : `Rooster of Rage cleared ${data.count} ${data.player} discs from Row ${ROWS - data.row}!`}
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
