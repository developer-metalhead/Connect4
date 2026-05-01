import React, { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../tokens";

const chickenRun = keyframes`
  0% { transform: translateX(-300px) translateY(0px) rotate(0deg); opacity: 0; }
  20% { transform: translateX(-150px) translateY(-30px) rotate(-10deg); opacity: 1; }
  40% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
  60% { transform: translateX(150px) translateY(-30px) rotate(10deg); opacity: 1; }
  100% { transform: translateX(450px) translateY(0px) rotate(0deg); opacity: 0; }
`;

const roosterFly = keyframes`
  0% { transform: translate(-400px, -50px) scale(1) rotate(-20deg); opacity: 0; }
  30% { transform: translate(-100px, -150px) scale(1.4) rotate(0deg); opacity: 1; }
  70% { transform: translate(300px, -120px) scale(1.6) rotate(10deg); opacity: 1; }
  100% { transform: translate(800px, -50px) scale(1) rotate(20deg); opacity: 0; }
`;

const poopAnim = keyframes`
  0% { transform: translateY(-100px) scale(0); opacity: 0; }
  60% { transform: translateY(0px) scale(1.3); opacity: 1; }
  100% { transform: translateY(0px) scale(1); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const AnimationOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});

const ChickenContainer = styled("div")(({ isRooster }) => ({
  position: "absolute",
  top: "30%",
  left: "0%",
  fontSize: isRooster ? "140px" : "100px",
  animation: isRooster 
    ? `${roosterFly} 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards` 
    : `${chickenRun} 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  zIndex: 1001,
  filter: isRooster ? "drop-shadow(0 0 40px #ff4500)" : "drop-shadow(0 0 20px rgba(0,0,0,0.5))",
}));

const VoiceLineCard = styled("div")({
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: `2px solid ${tokens.colors.primary}`,
  boxShadow: tokens.shadows.xl,
  padding: "20px 40px",
  borderRadius: tokens.radius.xl,
  color: tokens.colors.text,
  fontSize: "28px",
  fontWeight: 900,
  textAlign: "center",
  zIndex: 10002,
  animation: `${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const PoopOverlay = styled("div")(({ columnIndex }) => ({
  position: "absolute",
  top: "35%",
  left: `calc(${columnIndex} * (var(--cell) + var(--gap)) + var(--gap) + 50%)`,
  transform: "translateX(-50%)",
  fontSize: "60px",
  animation: `${poopAnim} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  zIndex: 1001,
  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
}));

const FireParticle = styled("div")(({ delay, startX }) => ({
  position: "absolute",
  left: `${startX}%`,
  top: "35%",
  fontSize: "40px",
  animation: "burnOut 0.8s forwards",
  animationDelay: `${delay}s`,
  opacity: 0,
  "@keyframes burnOut": {
    "0%": { opacity: 1, transform: "scale(1) rotate(0deg)" },
    "100%": { opacity: 0, transform: "scale(2) rotate(45deg) translateY(-50px)" }
  }
}));

const ChickenAnimation = ({
  isAnimating,
  voiceLine,
  isRooster = false,
  targetColumn = null,
  onAnimationComplete,
}) => {
  const [showPoop, setShowPoop] = useState(false);
  const [fireParticles, setFireParticles] = useState([]);

  useEffect(() => {
    if (!isAnimating) return;

    if (isRooster) {
      const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        delay: i * 0.1,
        startX: 5 + (i * 4),
      }));
      setFireParticles(particles);

      const timer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      const poopTimer = setTimeout(() => setShowPoop(true), 1200);
      const completeTimer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 2500);
      return () => {
        clearTimeout(poopTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isAnimating, isRooster, onAnimationComplete]);

  if (!isAnimating) return null;

  return (
    <AnimationOverlay>
      <ChickenContainer isRooster={isRooster}>
        {isRooster ? "🐓" : "🐔"}
      </ChickenContainer>

      {voiceLine && <VoiceLineCard>{voiceLine}</VoiceLineCard>}

      {!isRooster && showPoop && targetColumn !== null && (
        <PoopOverlay columnIndex={targetColumn}>
          💩
        </PoopOverlay>
      )}

      {isRooster && fireParticles.map(particle => (
        <FireParticle
          key={particle.id}
          delay={particle.delay}
          startX={particle.startX}
        >
          🔥
        </FireParticle>
      ))}
    </AnimationOverlay>
  );
};

export default ChickenAnimation;
