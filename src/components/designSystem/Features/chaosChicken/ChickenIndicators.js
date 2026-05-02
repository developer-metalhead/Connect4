import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../tokens";
import { CHICKEN_CONFIG } from "../../../../logic/funMode";


const IndicatorsContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  width: "100%",
  margin: "8px 0 16px 0",

  "@media (max-width: 768px)": {
    margin: "12px 0 12px 0", // Increased gap from scoreboard
    gap: "8px",
  }
});

const StatusBadge = styled("div", {
  shouldForwardProp: (prop) => !["isActive", "isRetired"].includes(prop),
})(({ isActive, isRetired }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 16px",
  borderRadius: tokens.radius.full,
  backgroundColor: isRetired 
    ? "rgba(0,0,0,0.2)" 
    : isActive 
    ? "rgba(255, 165, 0, 0.1)" 
    : "rgba(255, 255, 255, 0.05)",
  border: `1px solid ${
    isRetired 
      ? tokens.colors.borderLight 
      : isActive 
      ? tokens.colors.primary 
      : "rgba(255,255,255,0.1)"
  }`,
  boxShadow: isActive ? `0 0 15px rgba(255, 165, 0, 0.2)` : "none",
  transition: "all 0.3s ease",
  opacity: isRetired ? 0.6 : 1,
}));

const Label = styled("span")({
  fontSize: "12px",
  fontWeight: 800,
  color: tokens.colors.text,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const Emoji = styled("span")({
  fontSize: "18px",
});

const Count = styled("span")(({ count }) => ({
  fontSize: "11px",
  fontWeight: 900,
  color: count >= 1 ? tokens.colors.primary : tokens.colors.success,
  fontFamily: "monospace",
}));

const ChickenIndicators = ({ chaosChickenState, currentPlayer }) => {
  const p1Activations = chaosChickenState.chickenActivations?.player1 || 0;
  const p2Activations = chaosChickenState.chickenActivations?.player2 || 0;
  
  const p1Roosters = chaosChickenState.roosterCount?.player1 || 0;
  const p2Roosters = chaosChickenState.roosterCount?.player2 || 0;

  const p1Retired = p1Roosters >= CHICKEN_CONFIG.MAX_ROOSTER_PER_PLAYER;
  const p2Retired = p2Roosters >= CHICKEN_CONFIG.MAX_ROOSTER_PER_PLAYER;

  const getEmoji = (count, retired) => {
    if (retired) return "🐓💤";
    if (count === (CHICKEN_CONFIG.ROOSTER_THRESHOLD - 1)) return "🐓";
    return "🐔";
  };

  return (
    <IndicatorsContainer>
      <StatusBadge isActive={currentPlayer === "🔴" && !p1Retired} isRetired={p1Retired}>
        <Emoji>{getEmoji(p1Activations, p1Retired)}</Emoji>
        <Label>P1</Label>
        <Count count={p1Activations}>
          {p1Retired ? "MAX" : `${p1Activations}/${CHICKEN_CONFIG.ROOSTER_THRESHOLD}`}
        </Count>
      </StatusBadge>

      <StatusBadge isActive={currentPlayer === "🟡" && !p2Retired} isRetired={p2Retired}>
        <Emoji>{getEmoji(p2Activations, p2Retired)}</Emoji>
        <Label>P2</Label>
        <Count count={p2Activations}>
          {p2Retired ? "MAX" : `${p2Activations}/${CHICKEN_CONFIG.ROOSTER_THRESHOLD}`}
        </Count>
      </StatusBadge>
    </IndicatorsContainer>
  );
};

export default ChickenIndicators;
