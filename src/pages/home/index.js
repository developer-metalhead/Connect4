import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/buttonComponent";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";
import FunModeSettings from "../../components/funModeSettings/funModeSettings.js";
import { useState } from "react";
import useSoundManager from "../../hooks/core/useSoundManager.js";


const Home = () => {
  const navigate = useNavigate();
  const [showFunModeSettings, setShowFunModeSettings] = useState(false)

  const soundManager = useSoundManager();


  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>Choose Game Mode</BodyContainer>

      <ButtonContainer>
        <CustomButton onClick={() => navigate("/play-offline")}>
          Play Offline
        </CustomButton>
        <CustomButton onClick={() => navigate("/play-online")}>
          Play Online
        </CustomButton>
        <CustomButton onClick={() => setShowFunModeSettings(true)}>
          Fun Mode Settings
        </CustomButton>
      </ButtonContainer>
      {showFunModeSettings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <FunModeSettings
            soundManager={soundManager}
            onClose={() => setShowFunModeSettings(false)}
          />
        </div>
      )}
    </PageContainer>

    
  );
};

export default Home;
