import React from "react";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "../../components/designSystem/tokens";
import { PageWrapper } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import useSoundManager from "../../hooks/core/useSoundManager";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
`;

const SelectorContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%", // Fill width
  height: "100%", // Fill height
  gap: "40px",
  padding: "20px",
  background: "radial-gradient(circle at center, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
  backgroundSize: "200% 200%",
  animation: "gradientBG 15s ease infinite",
  "@keyframes gradientBG": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
});

const GlassCard = styled("div")({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "32px",
  padding: "60px 40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  animation: `${fadeIn} 1s ease-out forwards`,
  maxWidth: "500px",
  width: "100%",
});

const Logo = styled("h1")({
  fontSize: "clamp(48px, 10vw, 72px)",
  fontWeight: 900,
  margin: 0,
  background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-2px",
  animation: `${float} 6s ease-in-out infinite`,
});

const Subtitle = styled("p")({
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "18px",
  margin: "-20px 0 20px 0",
  fontWeight: 500,
});

const ButtonGroup = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
});

const VersionTag = styled("span")({
  fontSize: "12px",
  padding: "4px 10px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.1)",
  marginLeft: "8px",
  verticalAlign: "middle",
  fontWeight: 600,
});

const LandingPage = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();

  return (
    <PageWrapper>
      <SelectorContainer>
        <GlassCard>
          <Logo>Connect 4</Logo>
          <Subtitle>Select your experience</Subtitle>
          
          <ButtonGroup>
            <Button 
              variant="primary" 
              fullWidth 
              size="lg"
              onClick={() => navigate("/home")}
              soundManager={soundManager}
            >
              Play Overhauled <VersionTag>Recommended</VersionTag>
            </Button>
            
            <Button 
              variant="outline" 
              fullWidth 
              size="lg"
              onClick={() => navigate("/legacy")}
              soundManager={soundManager}
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "rgba(255, 255, 255, 0.8)"
              }}
            >
              Play Legacy <VersionTag>Classic</VersionTag>
            </Button>
          </ButtonGroup>
        </GlassCard>
      </SelectorContainer>
    </PageWrapper>
  );
};

export default LandingPage;
