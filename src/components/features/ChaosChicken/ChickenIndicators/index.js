import React from "react";
import { styled, keyframes } from "@mui/material/styles";

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const IndicatorsContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "400px",
  margin: "10px 0",
  padding: "0 20px",
});

const PlayerIndicator = styled("div")(({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 12px",
  borderRadius: "20px",
  background: isActive ? "rgba(255, 165, 0, 0.2)" : "rgba(255, 255, 255, 0.1)",
  border: isActive ? "2px solid #ffa500" : "1px solid #666",
  animation: isActive ? `${pulse} 2s infinite` : "none",
}));

const PlayerName = styled("span")({
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
});

const ChickenStatus = styled("span")(({ isRetired }) => ({
  fontSize: "16px",
  opacity: isRetired ? 0.5 : 1,
  filter: isRetired ? "grayscale(100%)" : "none",
}));

const ActivationCount = styled("span")(({ count, maxCount }) => ({
  color: count >= maxCount ? "#ff6b6b" : "#4caf50",
  fontSize: "12px",
  fontWeight: "bold",
}));

const ChickenIndicators = ({ chaosChickenState, currentPlayer }) => {
  const player1Activations = chaosChickenState.chickenActivations.player1;
  const player2Activations = chaosChickenState.chickenActivations.player2;
  const player1Retired = chaosChickenState.hasUsedRooster.player1;
  const player2Retired = chaosChickenState.hasUsedRooster.player2;

  const getChickenEmoji = (activations, isRetired) => {
    if (isRetired) return "🐓💤"; // Retired rooster
    if (activations === 1) return "🐓"; // Ready for rooster
    return "🐔"; // Regular chicken
  };

  return (
    <IndicatorsContainer>
      <PlayerIndicator isActive={currentPlayer === "🔴" && !player1Retired}>
        <PlayerName>🔴 Player 1</PlayerName>
        <ChickenStatus isRetired={player1Retired}>
          {getChickenEmoji(player1Activations, player1Retired)}
        </ChickenStatus>
        <ActivationCount count={player1Activations} maxCount={2}>
          {player1Retired ? "Retired" : `${player1Activations}/2`}
        </ActivationCount>
      </PlayerIndicator>

      <PlayerIndicator isActive={currentPlayer === "🟡" && !player2Retired}>
        <PlayerName>🟡 Player 2</PlayerName>
        <ChickenStatus isRetired={player2Retired}>
          {getChickenEmoji(player2Activations, player2Retired)}
        </ChickenStatus>
        <ActivationCount count={player2Activations} maxCount={2}>
          {player2Retired ? "Retired" : `${player2Activations}/2`}
        </ActivationCount>
      </PlayerIndicator>
    </IndicatorsContainer>
  );
};

export default ChickenIndicators;