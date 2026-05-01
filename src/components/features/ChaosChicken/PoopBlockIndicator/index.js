import React from "react";
import { styled, keyframes } from "@mui/material/styles";

const wobble = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-3deg) scale(1.05); }
  75% { transform: rotate(3deg) scale(1.05); }
`;

const stink = keyframes`
  0% { opacity: 0; transform: translateY(0px) scale(0.5); }
  50% { opacity: 1; transform: translateY(-20px) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
`;

const PoopContainer = styled("div")(({ columnIndex }) => ({
  position: "absolute",
  top: "-60px",
  left: `calc(${columnIndex} * (var(--cell) + var(--gap)) + var(--gap))`,
  width: "var(--cell)",
  height: "var(--cell)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  pointerEvents: "none",
}));

const PoopEmoji = styled("div")({
  fontSize: "calc(var(--cell) * 0.8)",
  animation: `${wobble} 2s infinite`,
  marginBottom: "5px",
});

const BlockedLabel = styled("div")({
  background: "rgba(255, 0, 0, 0.9)",
  color: "white",
  padding: "2px 8px",
  borderRadius: "12px",
  fontSize: "10px",
  fontWeight: "bold",
  textAlign: "center",
  border: "1px solid #fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
});

const StinkCloud = styled("div")(({ delay }) => ({
  position: "absolute",
  top: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "16px",
  animation: `${stink} 2s infinite`,
  animationDelay: `${delay}s`,
}));

const PoopBlockIndicator = ({ columnIndex, turnsLeft }) => {
  const stinkClouds = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
  }));

  return (
    <PoopContainer columnIndex={columnIndex}>
      <PoopEmoji>💩</PoopEmoji>
      <BlockedLabel>
        Blocked! {turnsLeft}
      </BlockedLabel>
      {stinkClouds.map(cloud => (
        <StinkCloud key={cloud.id} delay={cloud.delay}>
          💨
        </StinkCloud>
      ))}
    </PoopContainer>
  );
};

export default PoopBlockIndicator;