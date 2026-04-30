
import { styled, keyframes } from "@mui/material/styles";

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.8); }
`;
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
  
  