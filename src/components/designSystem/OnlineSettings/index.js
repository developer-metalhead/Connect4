import React from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";
import Input from "../Input";
import useOnlineConnect4 from "../../../hooks/core/useOnlineConnect4";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const Section = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const Label = styled("div")({
  fontSize: "14px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.7)",
  marginLeft: "4px",
});

const OnlineSettings = ({ soundManager }) => {
  const { setDisplayName } = useOnlineConnect4();
  const [name, setName] = React.useState(() => sessionStorage.getItem("c4_display_name") || "");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setDisplayName(val);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  return (
    <Container>
      <Section>
        <Label>Display Name</Label>
        <Input 
          placeholder="Enter your name..." 
          value={name}
          onChange={handleNameChange}
        />
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>
          This is how other players will see you in online rooms.
        </div>
      </Section>

      <Section>
        <Label>Server Region</Label>
        <div style={{ 
          padding: '12px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: tokens.radius.md,
          fontSize: '14px',
          color: tokens.colors.primary,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          ⚡ Global (Auto-select)
        </div>
      </Section>
    </Container>
  );
};

export default OnlineSettings;
