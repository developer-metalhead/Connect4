import React, { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../designSystem/tokens";

// --- ANIMATIONS ---
const actorRun = keyframes`
  0% { transform: translateX(-300px) translateY(0px) rotate(0deg); opacity: 0; }
  20% { transform: translateX(-150px) translateY(-30px) rotate(-10deg); opacity: 1; }
  40% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
  60% { transform: translateX(150px) translateY(-30px) rotate(10deg); opacity: 1; }
  100% { transform: translateX(450px) translateY(0px) rotate(0deg); opacity: 0; }
`;

const projectileDrop = keyframes`
  0% { transform: translateY(-100px) scale(0); opacity: 0; }
  60% { transform: translateY(0px) scale(1.3); opacity: 1; }
  100% { transform: translateY(0px) scale(1); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

// --- STYLES ---
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

const ActorContainer = styled("div")({
  position: "absolute",
  top: "30%",
  left: "0%",
  fontSize: "100px",
  animation: `${actorRun} 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  zIndex: 1001,
  filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))",
});

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

const ProjectileOverlay = styled("div")(({ columnIndex }) => ({
  position: "absolute",
  top: "35%",
  left: `calc(${columnIndex} * (var(--cell) + var(--gap)) + var(--gap) + 50%)`,
  transform: "translateX(-50%)",
  fontSize: "60px",
  animation: `${projectileDrop} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  zIndex: 1001,
  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
}));

/**
 * THE UNIVERSAL FEATURE ANIMATOR (PHASE 3)
 * Plays a side-scrolling animation for ANY character and ANY projectile.
 */
const FeatureAnimation = ({
  isAnimating,
  actor = "🐒",
  projectile = "🍌",
  voiceLine = "",
  targetColumn = null,
  onAnimationComplete,
}) => {
  const [showProjectile, setShowProjectile] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      setShowProjectile(false);
      return;
    }

    // Trigger the projectile drop halfway through the run
    const projectileTimer = setTimeout(() => setShowProjectile(true), 1200);
    
    // Complete the animation after the run finishes
    const completeTimer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 2500);

    return () => {
      clearTimeout(projectileTimer);
      clearTimeout(completeTimer);
    };
  }, [isAnimating, onAnimationComplete]);

  if (!isAnimating) return null;

  return (
    <AnimationOverlay>
      {/* THE WHO */}
      <ActorContainer>
        {actor}
      </ActorContainer>

      {/* THE DIALOGUE */}
      {voiceLine && <VoiceLineCard>{voiceLine}</VoiceLineCard>}

      {/* THE WHAT */}
      {showProjectile && targetColumn !== null && (
        <ProjectileOverlay columnIndex={targetColumn}>
          {projectile}
        </ProjectileOverlay>
      )}
    </AnimationOverlay>
  );
};

export default FeatureAnimation;
