import React from "react";
import { styled, keyframes } from "@mui/material/styles";

const chickenRun = keyframes`
  0% {
    transform: translateX(-200px) translateY(0px);
    opacity: 0;
  }
  20% {
    transform: translateX(-100px) translateY(-20px);
    opacity: 1;
  }
  40% {
    transform: translateX(0px) translateY(0px);
    opacity: 1;
  }
  60% {
    transform: translateX(100px) translateY(-20px);
    opacity: 1;
  }
  80% {
    transform: translateX(200px) translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateX(300px) translateY(0px);
    opacity: 0;
  }
`;

const roosterFly = keyframes`
  0% {
    transform: translateX(-300px) translateY(-50px) scale(1);
    opacity: 0;
  }
  20% {
    transform: translateX(-100px) translateY(-100px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translateX(200px) translateY(-80px) scale(1.5);
    opacity: 1;
  }
  80% {
    transform: translateX(500px) translateY(-120px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateX(700px) translateY(-50px) scale(1);
    opacity: 0;
  }
`;

const poop = keyframes`
  0% {
    transform: translateY(-50px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(0px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(0px) scale(1);
    opacity: 1;
  }
`;

const wobble = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
`;

const screenShake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const fireTrail = keyframes`
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.5); }
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

const ChickenContainer = styled("div")(({ isRooster }) => ({
  position: "absolute",
  top: "20%",
  left: "0%",
  fontSize: isRooster ? "120px" : "80px",
  animation: isRooster 
    ? `${roosterFly} 3s ease-out` 
    : `${chickenRun} 2s ease-out`,
  zIndex: 1001,
  filter: isRooster ? "drop-shadow(0 0 20px #ff4500)" : "none",
}));

const VoiceLineContainer = styled("div")({
  position: "absolute",
  top: "15%",
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

const PoopContainer = styled("div")(({ columnIndex }) => ({
  position: "absolute",
  top: "30%",
  left: `calc(${columnIndex} * (var(--cell) + var(--gap)) + var(--gap) + 50%)`,
  transform: "translateX(-50%)",
  fontSize: "40px",
  animation: `${poop} 1s ease-out, ${wobble} 2s infinite 1s`,
  zIndex: 1001,
}));

const FireTrailContainer = styled("div")({
  position: "absolute",
  top: "20%",
  left: "0%",
  width: "100%",
  height: "200px",
  zIndex: 1000,
  pointerEvents: "none",
});

const FireParticle = styled("div")(({ delay, startX }) => ({
  position: "absolute",
  left: `${startX}%`,
  top: "50%",
  fontSize: "30px",
  animation: `${fireTrail} 0.8s ease-out`,
  animationDelay: `${delay}s`,
}));

const ScreenShakeContainer = styled("div")(({ isShaking }) => ({
  width: "100%",
  height: "100%",
  animation: isShaking ? `${screenShake} 0.5s ease-in-out 3` : "none",
}));

const ChickenAnimation = ({
  isAnimating,
  voiceLine,
  isRooster = false,
  targetColumn = null,
  onAnimationComplete,
}) => {
  const [showPoop, setShowPoop] = React.useState(false);
  const [fireParticles, setFireParticles] = React.useState([]);

  React.useEffect(() => {
    if (!isAnimating) return;

    if (isRooster) {
      // Generate fire trail particles
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: i * 0.1,
        startX: 10 + (i * 4),
      }));
      setFireParticles(particles);

      // Complete rooster animation
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Show poop after chicken runs
      const poopTimer = setTimeout(() => {
        setShowPoop(true);
      }, 1500);

      // Complete chicken animation
      const completeTimer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2500);

      return () => {
        clearTimeout(poopTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isAnimating, isRooster, onAnimationComplete]);

  if (!isAnimating) return null;

  return (
    <ScreenShakeContainer isShaking={isRooster}>
      <AnimationOverlay>
        <ChickenContainer isRooster={isRooster}>
          {isRooster ? "🐓" : "🐔"}
        </ChickenContainer>

        {voiceLine && <VoiceLineContainer>{voiceLine}</VoiceLineContainer>}

        {!isRooster && showPoop && targetColumn !== null && (
          <PoopContainer columnIndex={targetColumn}>
            💩
          </PoopContainer>
        )}

        {isRooster && (
          <FireTrailContainer>
            {fireParticles.map(particle => (
              <FireParticle
                key={particle.id}
                delay={particle.delay}
                startX={particle.startX}
              >
                🔥
              </FireParticle>
            ))}
          </FireTrailContainer>
        )}
      </AnimationOverlay>
    </ScreenShakeContainer>
  );
};

export default ChickenAnimation;