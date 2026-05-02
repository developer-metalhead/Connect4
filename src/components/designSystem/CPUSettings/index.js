import React from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";
import { useCPUSettings } from "../../../hooks/core/useCPUSettings";
import Button from "../Button";
import { ToggleGroup, Label } from "../SoundSettings/SoundSettings.style";


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


const CPUSettings = ({ soundManager, onClose }) => {
  const { difficulty, seriousCPU, saveCPUSettings } = useCPUSettings();
  const [pendingDifficulty, setPendingDifficulty] = React.useState(difficulty);
  const [pendingSerious, setPendingSerious] = React.useState(seriousCPU);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSelect = (diff) => {
    setPendingDifficulty(diff);
    setIsSaved(false);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  const handleSave = () => {
    saveCPUSettings({
      difficulty: pendingDifficulty,
      seriousCPU: pendingSerious
    });
    setIsSaved(true);
    if (soundManager?.playClickSound) soundManager.playClickSound();
    if (onClose) onClose();
  };

  return (
    <Container>
      <ToggleGroup style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>🦾 Serious CPU</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            No animations or overlays on surrender
          </span>
        </div>
        <Button 
          variant={pendingSerious ? "primary" : "secondary"}
          size="sm"
          onClick={() => {
            setPendingSerious(!pendingSerious);
            if (soundManager?.playClickSound) soundManager.playClickSound();
          }}
          soundManager={soundManager}
        >
          {pendingSerious ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

      <DifficultyCard active={pendingDifficulty === "Novice"} onClick={() => handleSelect("Novice")}>
        <Title>Novice</Title>
        <Description>Makes occasional mistakes. Perfect for learning.</Description>
      </DifficultyCard>
      
      <DifficultyCard active={pendingDifficulty === "Skilled"} onClick={() => handleSelect("Skilled")}>
        <Title>Skilled</Title>
        <Description>A balanced opponent with decent tactical awareness.</Description>
      </DifficultyCard>
 
      <DifficultyCard active={pendingDifficulty === "Expert"} onClick={() => handleSelect("Expert")}>
        <Title>Expert</Title>
        <Description>Uses Minimax with alpha-beta pruning. Highly competitive.</Description>
      </DifficultyCard>

      <div style={{ marginTop: '12px' }}>
        <Button 
          variant="primary" 
          fullWidth 
          onClick={handleSave} 
          disabled={pendingDifficulty === difficulty && pendingSerious === seriousCPU && isSaved}
          soundManager={soundManager}
        >
          {isSaved ? "Saved!" : "Save"}
        </Button>
      </div>
    </Container>
  );
};

export default CPUSettings;
