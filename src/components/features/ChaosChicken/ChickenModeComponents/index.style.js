import { styled, keyframes } from "@mui/material/styles";

const chickenGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 140, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 140, 0, 0.8); }
`;

export const ChickenStatusIndicator = styled("div")({
  background: "linear-gradient(45deg, #ff8c00, #ffa500)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "20px",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center",
  animation: `${chickenGlow} 2s infinite`,
  marginBottom: "10px",
  border: "2px solid #fff",
  boxShadow: "0 6px 15px rgba(255, 140, 0, 0.4)",
});