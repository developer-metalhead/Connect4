import React from "react";
import { EMOJIS } from "../../logic/core/coreConfig";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../hooks/core/useSoundManager";
import { RefreshIconButton } from "../../components/designSystem/Layout.style";

// New UI Components
import { PageWrapper, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import BackButton from "../../components/designSystem/BackButton";
import { 
  OfflineHeader, 
  OfflineSubtitle, 
  SelectionGrid 
} from "./index.style";
import SettingsMenu from "../../components/designSystem/SettingsMenu";
import SidePanel from "../../components/designSystem/SidePanel";
import CPUSettings from "../../components/designSystem/CPUSettings";
import FunModeSettings from "../../components/designSystem/FunModeSettings";
import OnlineSettings from "../../components/designSystem/OnlineSettings";
import SoundSettings from "../../components/designSystem/SoundSettings";
import BoardSettings from "../../components/designSystem/BoardSettings";
import GameSettings from "../../components/designSystem/GameSettings";
import { useState } from "react";

const OfflineV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'cpu', 'fun', 'sound' or null

  return (
    <PageWrapper>
      <BackButton soundManager={soundManager} onClick={() => navigate("/home")} />
      
      <SettingsMenu
        soundManager={soundManager}
        activeOption={activePanel}
        onOptionClick={(id) => setActivePanel(activePanel === id ? null : id)}
        options={[
          { id: 'game', label: 'Game Settings', icon: <span>{EMOJIS.UI_GAME}</span> },
          { id: 'sound', label: 'Sound Settings', icon: <span>{EMOJIS.UI_SOUND}</span> },
          { id: 'board', label: 'Board Settings', icon: <span>{EMOJIS.UI_BOARD}</span> },
          { id: 'cpu', label: 'CPU Settings', icon: <span>{EMOJIS.UI_CPU}</span> },
          { id: 'fun', label: 'Fun Mode Settings', icon: <span>{EMOJIS.UI_FUN}</span> },
        ]}
      />

      <SidePanel 
        isOpen={activePanel !== null} 
        onClose={() => setActivePanel(null)}
        title={
          activePanel === 'game' ? 'Game Settings' :
          activePanel === 'sound' ? 'Sound Settings' :
          activePanel === 'board' ? 'Board Settings' :
          activePanel === 'cpu' ? 'CPU Settings' :
          'Fun Mode Settings'
        }
      >
        {activePanel === 'cpu' && <CPUSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'fun' && <FunModeSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'sound' && <SoundSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'game' && <GameSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'board' && <BoardSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
      </SidePanel>
      <MainContent style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <OfflineHeader>Connect 4</OfflineHeader>
          <OfflineSubtitle>Select your challenge and play locally.</OfflineSubtitle>

          <SelectionGrid>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/play-offline/2p")}
              soundManager={soundManager}
            >
              VS 2nd Player
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/play-offline/cpu")}
              soundManager={soundManager}
            >
              VS CPU (AI)
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth 
              onClick={() => navigate("/play-fun")}
              soundManager={soundManager}
            >
              Fun Mode (Chaos)
            </Button>
          </SelectionGrid>
        </div>
      </MainContent>
    </PageWrapper>
  );
};

export default OfflineV2;
