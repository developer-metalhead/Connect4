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

export const UpsideDownIndicator = styled("div")({
  background: "linear-gradient(45deg, #ff6b35, #ffa500)",
  color: "white",
  padding: "15px 30px",
  borderRadius: "25px",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  animation: `${glow} 2s infinite`,
  marginBottom: "10px",
  border: "3px solid #fff",
  boxShadow: "0 8px 20px rgba(255, 107, 53, 0.4)",
});

export const FunModeBoard = styled("div")(({ isUpsideDown }) => ({
  transform: isUpsideDown ? "rotateX(180deg)" : "rotateX(0deg)",
  transition: "transform 0.5s ease-in-out",
  position: "relative",

  // Add vine decorations when upside down
  ...(isUpsideDown && {
    "&::before": {
      content: '"🌿"',
      position: "absolute",
      top: "-30px",
      left: "-20px",
      fontSize: "30px",
      animation: `${vine} 2s infinite`,
      zIndex: 1,
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
