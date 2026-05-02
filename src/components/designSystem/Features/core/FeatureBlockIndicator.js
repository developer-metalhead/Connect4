import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../tokens";

// --- ANIMATIONS ---
const wobble = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.1); }
  75% { transform: rotate(5deg) scale(1.1); }
`;

const stink = keyframes`
  0% { opacity: 0; transform: translateY(0px) scale(0.5); }
  50% { opacity: 0.6; transform: translateY(-25px) scale(1); }
  100% { opacity: 0; transform: translateY(-50px) scale(0.5); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4)); }
  50% { filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.8)); }
`;

// --- STYLED COMPONENTS ---
const IndicatorContainer = styled("div")(({ columnIndex }) => ({
  position: "absolute",
  top: "-70px",
  left: `calc(var(--board-padding) + ${columnIndex} * (var(--cell) + var(--gap)))`,
  width: "var(--cell)",
  height: "var(--cell)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  pointerEvents: "none",

  "@media (max-width: 768px)": {
    top: "-40px",
  },
}));

const IndicatorEmoji = styled("div")({
  fontSize: "calc(var(--cell) * 0.85)",
  animation: `${wobble} 2s infinite ease-in-out, ${glow} 2s infinite`,
  marginBottom: "4px",
});

const BlockedLabel = styled("div")({
  background: tokens.colors.danger,
  color: "#fff",
  padding: "4px 10px",
  borderRadius: tokens.radius.full,
  fontSize: "11px",
  fontWeight: 800,
  textAlign: "center",
  boxShadow: tokens.shadows.md,
  border: "1px solid rgba(255,255,255,0.2)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
});

const EffectCloud = styled("div")(({ delay }) => ({
  position: "absolute",
  top: "-15px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "18px",
  animation: `${stink} 2s infinite`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

/**
 * THE UNIVERSAL BLOCK INDICATOR (PHASE 3)
 * Displays whatever projectile blocked the column (Poop, Banana, etc.)
 */
const FeatureBlockIndicator = ({ columnIndex, turnsLeft, projectile = "💩", isUpsideDown = false }) => {
  const particles = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 0.6,
  }));

  // Choose effect emoji based on the projectile
  const effectEmoji = projectile === "💩" ? "💨" : (projectile === "🍌" ? "✨" : "💢");

  console.log('hey projectile',projectile)

  return (
    <IndicatorContainer
      columnIndex={columnIndex}
      style={{ transform: isUpsideDown ? "rotate(180deg)" : "none" }}
    >
      {/* THE DYNAMIC EMOJI */}
      <IndicatorEmoji>{projectile}</IndicatorEmoji>
      
      <BlockedLabel>
        Blocked ({turnsLeft})
      </BlockedLabel>

      {/* Floating particles for extra juice */}
      {particles.map(p => (
        <EffectCloud key={p.id} delay={p.delay}>
          {effectEmoji}
        </EffectCloud>
      ))}
    </IndicatorContainer>
  );
};

export default FeatureBlockIndicator;
