import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../hooks/core/useSoundManager.js";
import { RefreshIconButton } from "../../components/designSystem/Layout.style";

// New UI Components
import { PageWrapper, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import BackButton from "../../components/designSystem/BackButton";
import SettingsMenu from "../../components/designSystem/SettingsMenu";
import SidePanel from "../../components/designSystem/SidePanel";
import CPUSettings from "../../components/designSystem/CPUSettings";
import FunModeSettings from "../../components/designSystem/FunModeSettings";
import OnlineSettings from "../../components/designSystem/OnlineSettings";
import SoundSettings from "../../components/designSystem/SoundSettings";
import BoardSettings from "../../components/designSystem/BoardSettings";
import Modal from "../../components/designSystem/Modal";
import { 
  HomeHeader, 
  HomeSubtitle, 
  MenuGrid,
  Decoration 
} from "./index.style";



const HomeV2 = () => {
  const navigate = useNavigate();
  const [showFunModeSettings, setShowFunModeSettings] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'fun', 'sound' or null


  return (
    <PageWrapper>
      <BackButton onClick={() => navigate("/")} soundManager={soundManager} />
      
      <SettingsMenu
        soundManager={soundManager}
        activeOption={activePanel}
        onOptionClick={(id) => setActivePanel(activePanel === id ? null : id)}
        options={[
          { id: 'cpu', label: 'CPU Settings', icon: <span>🤖</span> },
          { id: 'fun', label: 'Fun Mode Settings', icon: <span>🔥</span> },
          { id: 'online', label: 'Online Settings', icon: <span>🌐</span> },
          { id: 'sound', label: 'Sound Settings', icon: <span>🔊</span> },
          { id: 'board', label: 'Board Settings', icon: <span>⚙️</span> },
        ]}
      />

      <SidePanel 
        isOpen={activePanel !== null} 
        onClose={() => setActivePanel(null)}
        title={
          activePanel === 'cpu' ? 'CPU Settings' :
          activePanel === 'fun' ? 'Fun Mode Settings' :
          activePanel === 'online' ? 'Online Settings' :
          activePanel === 'board' ? 'Board Settings' :
          'Sound Settings'
        }
      >
        {activePanel === 'cpu' && <CPUSettings soundManager={soundManager} />}
        {activePanel === 'fun' && <FunModeSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'online' && <OnlineSettings soundManager={soundManager} />}
        {activePanel === 'sound' && <SoundSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'board' && <BoardSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
      </SidePanel>

      <Decoration style={{ top: '20%', left: '10%' }} />
      <Decoration style={{ bottom: '20%', right: '10%', background: '#6366f1' }} />
      
      <MainContent style={{ justifyContent: 'center' }}>
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
              onClick={() => navigate("/play-offline")}
              soundManager={soundManager}
            >
              Play Offline
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/play-online")}
              soundManager={soundManager}
            >
              Play Online
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