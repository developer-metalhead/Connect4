/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo,useState } from "react";
import useSoundManager from "../../../hooks/core/useSoundManager";
import useConnect4CPU from "../../../hooks/core/useConnect4CPU";
import { PLAYER1, PLAYER2 } from "../../../helperFunction/helperFunction";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../../components/designSystem/Layout.style";
import Button from "../../../components/designSystem/Button";
import Scoreboard from "../../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../../components/designSystem/Status";
import { GameLayout, ControlGroup } from "./index.style";

// Original Logic Components
import Board from "../../../components/organisms/boardStyles";
import PostVideoOverlay from "../../../components/designSystem/PostVideoOverlay";
import VideoButton from "../../../components/designSystem/VideoButton";
import PoopBlockIndicator from "../../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import SettingsMenu from "../../../components/designSystem/SettingsMenu";
import SidePanel from "../../../components/designSystem/SidePanel";
import CPUSettings from "../../../components/designSystem/CPUSettings";
import FunModeSettings from "../../../components/designSystem/FunModeSettings";
import SoundSettings from "../../../components/designSystem/SoundSettings";
import BackButton from "../../../components/designSystem/BackButton";
import Modal from "../../../components/designSystem/Modal";

const PlayCPUV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'cpu', 'fun', 'sound' or null

  const { 
    gameState, 
    makeHumanMove, 
    reset, 
    isCpuTurn, 
    isCpuDropping, 
    cpuDroppingCol,
    shouldShowPostVideoOverlay,
    closePostVideoOverlay
  } = useConnect4CPU();

  const { board, currentPlayer, winner, isDraw } = gameState;

  useEffect(() => {
    if (winner) {
      if (winner === PLAYER1) {
        soundManager.playWinSound();
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  useEffect(() => {
    if (isCpuDropping && soundManager) {
      setTimeout(() => {
        soundManager.playDropSound();
      }, 100);
    }
  }, [isCpuDropping, soundManager]);

  const handleClosePostVideoOverlay = () => {
    closePostVideoOverlay();
    reset();
  };

  // Scoreboard data
  const p1Data = useMemo(() => ({
    name: "Player",
    score: gameState.scores?.[PLAYER1] || 0,
    active: currentPlayer === PLAYER1 && !winner && !isDraw,
    emoji: PLAYER1
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  const p2Data = useMemo(() => ({
    name: "CPU",
    score: gameState.scores?.[PLAYER2] || 0,
    active: currentPlayer === PLAYER2 && !winner && !isDraw,
    emoji: PLAYER2
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  return (
    <PageWrapper>
      <BackButton soundManager={soundManager} />
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => navigate("/home")}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>vs CPU</span>
          </AppLogo>
          
          <SettingsMenu
            soundManager={soundManager}
            activeOption={activePanel}
            onOptionClick={(id) => setActivePanel(activePanel === id ? null : id)}
            options={[
              { id: 'cpu', label: 'CPU Settings', icon: <span>🤖</span> },
              { id: 'fun', label: 'Fun Mode Settings', icon: <span>🔥</span> },
              { id: 'sound', label: 'Sound Settings', icon: <span>🔊</span> },
            ]}
          />
        </HeaderContent>
      </Header>

      <SidePanel 
        isOpen={activePanel !== null} 
        onClose={() => setActivePanel(null)}
        title={
          activePanel === 'cpu' ? 'CPU Settings' :
          activePanel === 'fun' ? 'Fun Mode Settings' :
          'Sound Settings'
        }
      >
        {activePanel === 'cpu' && <CPUSettings soundManager={soundManager} />}
        {activePanel === 'fun' && <FunModeSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'sound' && <SoundSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
      </SidePanel>

      <MainContent>
        <GameLayout>
          <Scoreboard p1={p1Data} p2={p2Data} />

          <Board
            board={board}
            currentPlayer={PLAYER1}
            winner={winner}
            isDraw={isDraw}
            onDrop={makeHumanMove}
            canInteract={!isCpuTurn}
            soundManager={soundManager}
            isCpuDropping={isCpuDropping}
            cpuDroppingCol={cpuDroppingCol}
            winningLine={gameState.winningLine}
            PoopBlockIndicatorComponent={PoopBlockIndicator}
          />

          <GameStatus 
            message={
              winner 
                ? (winner === PLAYER1 ? "You Win!" : "CPU Wins!") 
                : isDraw 
                ? "It's a Draw!" 
                : isCpuTurn 
                ? "CPU is thinking..." 
                : "Your Turn"
            }
            currentPlayerColor={currentPlayer === PLAYER1 ? "red" : "yellow"}
          />

          <ControlGroup>
            <VideoButton onGameReset={reset}>
               Give Up!
            </VideoButton>
            <Button variant="secondary" fullWidth onClick={reset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>
        </GameLayout>
      </MainContent>

      {/* Human Win/Draw Overlay */}
      {(winner === PLAYER1 || isDraw) && (
        <MatchResultOverlay 
          title={winner === PLAYER1 ? "VICTORY" : "DRAW"}
          subtitle={winner === PLAYER1 ? "You outsmarted the machine!" : "A tactical stalemate."}
          variant={winner === PLAYER1 ? "win" : "draw"}
          onPrimaryAction={reset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/home")}
          soundManager={soundManager}
        />
      )}

      {/* CPU Win special overlay */}
      <PostVideoOverlay
        isVisible={shouldShowPostVideoOverlay}
        onClose={handleClosePostVideoOverlay}
        soundManager={soundManager}
      />

    </PageWrapper>
  );
};

export default PlayCPUV2;