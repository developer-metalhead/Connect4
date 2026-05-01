import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../tokens";


const swingIn = keyframes`
  0% { transform: translateX(-300px) translateY(-100px) rotate(-30deg); opacity: 0; }
  50% { transform: translateX(-50px) translateY(50px) rotate(15deg); opacity: 1; }
  100% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -20px); }
`;

const AnimationOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(6px)",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});

const MonkeyContainer = styled("div")({
  position: "absolute",
  top: "15%",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "120px",
  animation: `${swingIn} 1s cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 1001,
  filter: "drop-shadow(0 0 30px rgba(0,0,0,0.5))",
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
  animation: `${slideUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const BannerCard = styled("div")({
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: tokens.colors.primary,
  color: "#000",
  padding: "24px 48px",
  borderRadius: tokens.radius.xl,
  fontSize: "40px",
  fontWeight: 900,
  textAlign: "center",
  zIndex: 10002,
  boxShadow: tokens.shadows.xl,
  animation: `${bounce} 1s ease-in-out infinite`,
  textTransform: "uppercase",
  letterSpacing: "2px",
});

const MonkeyAnimation = ({
  isAnimating,
  voiceLine,
  isFlippingBack = false,
}) => {
  if (!isAnimating) return null;

  return (
    <AnimationOverlay>
      <MonkeyContainer>
        <div style={{ animation: "rotateHead 0.5s infinite ease-in-out" }}>
          {isFlippingBack ? "😴" : "🐒"}
        </div>
      </MonkeyContainer>

      {voiceLine && <VoiceLineCard>{voiceLine}</VoiceLineCard>}

      {!isFlippingBack && (
        <BannerCard>
          🍌 UPSIDE DOWN! 🍌
        </BannerCard>
      )}

      <style>
        {`
          @keyframes rotateHead {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-8deg); }
            75% { transform: rotate(8deg); }
          }
        `}
      </style>
    </AnimationOverlay>
  );
};

export default MonkeyAnimation;
