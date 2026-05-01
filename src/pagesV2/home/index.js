import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../hooks/core/useSoundManager.js";

// New UI Components
import { PageWrapper, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import Modal from "../../components/designSystem/Modal";
import { 
  HomeHeader, 
  HomeSubtitle, 
  MenuGrid,
  Decoration 
} from "./index.style";

import FunModeSettings from "../../components/organisms/funModeSettings/funModeSettings.js";
import SoundSettings from "../../components/designSystem/SoundSettings";

const HomeV2 = () => {
  const navigate = useNavigate();
  const [showFunModeSettings, setShowFunModeSettings] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const soundManager = useSoundManager();

  return (
    <PageWrapper>
      <Decoration style={{ top: '20%', left: '10%' }} />
      <Decoration style={{ bottom: '20%', right: '10%', background: '#6366f1' }} />
      
      <MainContent style={{ justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HomeHeader>Connect 4</HomeHeader>
          <HomeSubtitle>
            A modern take on the classic strategy game. Choose your mode and start playing.
          </HomeSubtitle>

          <MenuGrid>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/v2/play-offline")}
              soundManager={soundManager}
            >
              Play Offline
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/v2/play-online")}
              soundManager={soundManager}
            >
              Play Online
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth 
              onClick={() => setShowFunModeSettings(true)}
              soundManager={soundManager}
            >
              Fun Mode Settings
            </Button>

            <Button 
              variant="ghost" 
              size="md" 
              fullWidth 
              onClick={() => setShowSoundSettings(true)}
              soundManager={soundManager}
            >
              🔊 Sound Settings
            </Button>
          </MenuGrid>
        </div>
      </MainContent>

      <Modal 
        isOpen={showFunModeSettings} 
        onClose={() => setShowFunModeSettings(false)}
        title="Fun Mode Settings"
        maxWidth="600px"
      >
        <FunModeSettings
          soundManager={soundManager}
          onClose={() => setShowFunModeSettings(false)}
        />
      </Modal>

      <Modal 
        isOpen={showSoundSettings} 
        onClose={() => setShowSoundSettings(false)}
        title="Sound Settings"
      >
        <SoundSettings
          soundManager={soundManager}
          onClose={() => setShowSoundSettings(false)}
        />
      </Modal>
    </PageWrapper>
  );
};

export default HomeV2;