import React from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const DifficultyCard = styled("div")(({ active }) => ({
  background: active ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
  border: active ? `1px solid ${tokens.colors.primary}` : "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: tokens.radius.md,
  padding: "16px",
  cursor: "pointer",
  transition: "all 0.2s",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.12)",
  },
}));

const Title = styled("div")({
  fontWeight: 600,
  fontSize: "16px",
  marginBottom: "4px",
});

const Description = styled("div")({
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.6)",
});

const CPUSettings = ({ soundManager }) => {
  // Placeholder difficulty settings
  const [difficulty, setDifficulty] = React.useState("Expert");

  const handleSelect = (diff) => {
    setDifficulty(diff);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  return (
    <Container>
      <DifficultyCard active={difficulty === "Novice"} onClick={() => handleSelect("Novice")}>
        <Title>Novice</Title>
        <Description>Makes occasional mistakes. Perfect for learning.</Description>
      </DifficultyCard>
      
      <DifficultyCard active={difficulty === "Skilled"} onClick={() => handleSelect("Skilled")}>
        <Title>Skilled</Title>
        <Description>A balanced opponent with decent tactical awareness.</Description>
      </DifficultyCard>

      <DifficultyCard active={difficulty === "Expert"} onClick={() => handleSelect("Expert")}>
        <Title>Expert (Active)</Title>
        <Description>Uses Minimax with alpha-beta pruning. Highly competitive.</Description>
      </DifficultyCard>
    </Container>
  );
};

export default CPUSettings;
