import React from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../designSystem/tokens";

const IndicatorsContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  width: "100%",
  margin: "8px 0 16px 0",
  flexWrap: "wrap",

  "@media (max-width: 768px)": {
    margin: "12px 0 12px 0",
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

const Count = styled("span")(({ isReady }) => ({
  fontSize: "11px",
  fontWeight: 900,
  color: isReady ? tokens.colors.success : tokens.colors.primary,
  fontFamily: "monospace",
}));

/**
 * THE UNIVERSAL FEATURE STATUS INDICATOR (PHASE 3)
 * Displays progress for characters that have an ULTIMATE ability.
 */
const FeatureStatusIndicators = ({ config, stats, currentPlayer }) => {
  // REQUIREMENT: Only render if an ULTIMATE_THRESHOLD exists in the config
  if (!config || !stats || !config.ULTIMATE_THRESHOLD) return null;

  const players = [
    { id: "🔴", label: "P1" },
    { id: "🟡", label: "P2" }
  ];

  const getVisuals = (playerStats) => {
    const count = playerStats || 0;
    const threshold = config.ULTIMATE_THRESHOLD;
    const isReady = count >= threshold;
    
    // Choose emoji based on progress
    let emoji = config.ACTOR;
    if (isReady) {
      if (config.NAME === "CHICKEN") emoji = "🐓";
      else if (config.NAME === "MONKEY") emoji = "🐒🔥";
      else emoji = "🌟"; // Default ultimate emoji
    }

    return { count, threshold, isReady, emoji };
  };

  return (
    <IndicatorsContainer>
      {players.map(player => {
        const { count, threshold, isReady, emoji } = getVisuals(stats[player.id]);
        const isActive = currentPlayer === player.id;

        return (
          <StatusBadge key={player.id} isActive={isActive}>
            <Emoji>{emoji}</Emoji>
            <Label>{player.label}</Label>
            <Count isReady={isReady}>
              {count}/{threshold}
            </Count>
          </StatusBadge>
        );
      })}
    </IndicatorsContainer>
  );
};

export default FeatureStatusIndicators;
