import React from "react";
import { styled, keyframes } from "@mui/material/styles";

const swingIn = keyframes`
  0% {
    transform: translateX(-200px) translateY(-100px) rotate(-20deg);
    opacity: 0;
  }
  50% {
    transform: translateX(-50px) translateY(50px) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
`;

const scratchHead = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
`;

const boardFlip = keyframes`
  0% {
    transform: perspective(1000px) rotateX(0deg) scale(1);
  }
  25% {
    transform: perspective(1000px) rotateX(45deg) scale(1.1);
  }
  50% {
    transform: perspective(1000px) rotateX(90deg) scale(1.2);
  }
  75% {
    transform: perspective(1000px) rotateX(135deg) scale(1.1);
  }
  100% {
    transform: perspective(1000px) rotateX(180deg) scale(1);
  }
`;

const pieceFly = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) rotate(360deg);
    opacity: 1;
  }
`;

const dustParticle = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-50px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
`;

const AnimationOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.3)",
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});

const MonkeyContainer = styled("div")({
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "80px",
  animation: `${swingIn} 1s ease-out`,
  zIndex: 1001,
});

const MonkeyEmoji = styled("div")({
  animation: `${scratchHead} 0.5s ease-in-out 1s 3`,
});

const BoardFlipContainer = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  animation: `${boardFlip} 2s ease-in-out 1.5s`,
  zIndex: 1000,
});

const VoiceLineContainer = styled("div")({
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "15px 30px",
  borderRadius: "25px",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  zIndex: 1002,
  border: "3px solid #ffa500",
  boxShadow: "0 8px 20px rgba(255, 165, 0, 0.4)",
});
const bounce = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-20px); }
`;
const UpsideDownBanner = styled("div")({
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(45deg, #ff6b35, #ffa500)",
  color: "white",
  padding: "20px 40px",
  borderRadius: "30px",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center",
  zIndex: 1002,
  boxShadow: "0 8px 20px rgba(255, 107, 53, 0.6)",
  animation: `${bounce} 1s ease-in-out 3.5s`,
});

const SpinningBanana = styled("span")({
  display: "inline-block",
  fontSize: "30px",
  margin: "0 10px",
  animation: `${scratchHead} 1s infinite`,
});

const DustParticles = styled("div")({
  position: "absolute",
  bottom: "40%",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1001,
});

const DustParticle = styled("div")(({ delay }) => ({
  position: "absolute",
  fontSize: "20px",
  animation: `${dustParticle} 1s ease-out`,
  animationDelay: `${delay}s`,
  left: `${Math.random() * 200 - 100}px`,
}));

const MonkeyFlipAnimation = ({
  isAnimating,
  voiceLine,
  isFlippingBack = false,
}) => {
  if (!isAnimating) return null;

  const dustParticles = Array.from({ length: 8 }, (_, i) => (
    <DustParticle key={i} delay={3.5 + i * 0.1}>
      💨
    </DustParticle>
  ));

  return (
    <AnimationOverlay>
      <MonkeyContainer>
        <MonkeyEmoji>{isFlippingBack ? "😴" : "🐒"}</MonkeyEmoji>
      </MonkeyContainer>

      {voiceLine && <VoiceLineContainer>{voiceLine}</VoiceLineContainer>}

      <BoardFlipContainer>
        <div style={{ fontSize: "100px", opacity: 0.3 }}>🎯</div>
      </BoardFlipContainer>

      {!isFlippingBack && (
        <UpsideDownBanner>
          <SpinningBanana>🍌</SpinningBanana>
          UPSIDE DOWN MODE!
          <SpinningBanana>🍌</SpinningBanana>
        </UpsideDownBanner>
      )}

      <DustParticles>{dustParticles}</DustParticles>
    </AnimationOverlay>
  );
};

export default MonkeyFlipAnimation;
