import React from "react";
import { styled, keyframes } from "@mui/material/styles";

const chickenRun = keyframes`
  0% {
    transform: translateX(-200px) scaleX(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(100vw + 200px)) scaleX(1);
    opacity: 0;
  }
`;

const chickenRunReverse = keyframes`
  0% {
    transform: translateX(calc(100vw + 200px)) scaleX(-1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(-200px) scaleX(-1);
    opacity: 0;
  }
`;

const wingFlap = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-15deg); }
`;

const poopDrop = keyframes`
  0% {
    transform: translateY(-50px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(0) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(10px) scale(1);
    opacity: 1;
  }
`;

const roosterFire = keyframes`
  0%, 100% { 
    filter: hue-rotate(0deg) brightness(1);
    transform: scale(1);
  }
  50% { 
    filter: hue-rotate(60deg) brightness(1.5);
    transform: scale(1.1);
  }
`;

const screenShake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const AnimationOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.1)",
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});

const ChickenContainer = styled("div")(({ isRooster, direction }) => ({
  position: "absolute",
  top: "20%",
  left: 0,
  fontSize: isRooster ? "120px" : "80px",
  animation: direction === "left" 
    ? `${chickenRun} 3s ease-in-out`
    : `${chickenRunReverse} 3s ease-in-out`,
  zIndex: 1001,
  filter: isRooster ? "hue-rotate(0deg) brightness(1.2)" : "none",
  ...(isRooster && {
    animation: `${direction === "left" ? chickenRun : chickenRunReverse} 3s ease-in-out, ${roosterFire} 0.5s infinite`,
  }),
}));

const ChickenEmoji = styled("div")({
  animation: `${wingFlap} 0.3s ease-in-out infinite`,
});

const VoiceLineContainer = styled("div")({
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(255, 165, 0, 0.9)",
  color: "white",
  padding: "15px 30px",
  borderRadius: "25px",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  zIndex: 1002,
  border: "3px solid #ff8c00",
  boxShadow: "0 8px 20px rgba(255, 140, 0, 0.6)",
});

const PoopAnimation = styled("div")({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "60px",
  animation: `${poopDrop} 1s ease-out 2s`,
  zIndex: 1001,
});

const ShakeContainer = styled("div")(({ isRooster }) => ({
  ...(isRooster && {
    animation: `${screenShake} 0.1s infinite`,
  }),
}));

const ChickenAnimation = ({
  isAnimating,
  voiceLine,
  action,
  isRooster = false,
}) => {
  if (!isAnimating) return null;

  const direction = Math.random() > 0.5 ? "left" : "right";

  return (
    <ShakeContainer isRooster={isRooster}>
      <AnimationOverlay>
        <ChickenContainer isRooster={isRooster} direction={direction}>
          <ChickenEmoji>
            {isRooster ? "🐓" : "🐔"}
          </ChickenEmoji>
        </ChickenContainer>

        {voiceLine && (
          <VoiceLineContainer>
            {voiceLine}
          </VoiceLineContainer>
        )}

        {action === 'poop' && (
          <PoopAnimation>
            💩
          </PoopAnimation>
        )}

        {action === 'wipe' && isRooster && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "100px",
              zIndex: 1001,
              animation: `${roosterFire} 0.5s infinite`,
            }}
          >
            🔥💥🔥
          </div>
        )}
      </AnimationOverlay>
    </ShakeContainer>
  );
};

export default ChickenAnimation;