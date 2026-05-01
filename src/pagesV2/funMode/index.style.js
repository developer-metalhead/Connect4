import { styled, keyframes } from "@mui/material/styles";

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.8); }
`;

const flip = keyframes`
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(180deg); }
`;

const vine = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: "24px",
});

export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  fontSize: "64px",
  padding: "16px",
  gap: "24px",
  textAlign: "center",
});

export const BodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  color: "#FFFFFF73",
  fontSize: "24px",
  padding: "16px",
  gap: "24px",
  textAlign: "center",
});

export const PageContainer = styled("div")({
  background: "#0f0f0f",
  gap: "clamp(12px, 3vw, 24px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  minHeight: "100dvh",
  width: "100%",
  padding: "clamp(12px, 3vw, 24px)",
  margin: 0,
  overflowX: "hidden",
  boxSizing: "border-box",
  position: "relative",
});


// CHANGE: Removed CSS transform that was blocking pointer events
export const FunModeBoard = styled("div")(({ isUpsideDown }) => ({
  position: "relative",

  // CHANGE: Use visual indicators instead of transform to maintain interactivity
  ...(isUpsideDown && {
    "&::before": {
      content: '"🙃 GRAVITY REVERSED 🙃"',
      position: "absolute",
      top: "-50px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "16px",
      color: "#ffa500",
      fontWeight: "bold",
      zIndex: 1,
      background: "rgba(0,0,0,0.8)",
      padding: "5px 15px",
      borderRadius: "15px",
      border: "2px solid #ffa500",
      animation: `${glow} 2s infinite`,
    },
    "&::after": {
      content: '"🌿"',
      position: "absolute",
      top: "-30px",
      right: "-20px",
      fontSize: "30px",
      animation: `${vine} 2s infinite 0.5s`,
      zIndex: 1,
    },
  }),
}));

// CHANGE: Add overlay component for monkey mode background dimming
export const MonkeyModeOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  zIndex: 500,
  pointerEvents: "none", // Allow clicks to pass through to monkey button
});
