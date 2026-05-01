import React from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../hooks/core/useSoundManager";

// New UI Components
import { PageWrapper, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import BackButton from "../../components/designSystem/BackButton";
import { 
  OfflineHeader, 
  OfflineSubtitle, 
  SelectionGrid 
} from "./index.style";

const OfflineV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();

  return (
    <PageWrapper>
      <BackButton soundManager={soundManager} onClick={() => navigate("/home")} />
      <MainContent style={{ justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <OfflineHeader>Offline Mode</OfflineHeader>
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
