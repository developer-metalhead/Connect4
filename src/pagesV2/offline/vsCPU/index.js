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
import PoopBlockIndicator from "../../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import BackButton from "../../../components/designSystem/BackButton";
import GiveUpButton from "../../../components/designSystem/GiveUpButton";
import useFunModeSettings from "../../../hooks/funMode/useFunModeSettings";
import Modal from "../../../components/designSystem/Modal";

const PlayCPUV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const { monkeyAnimationEnabled } = useFunModeSettings();
  const [activePanel, setActivePanel] = useState(null); // 'cpu', 'fun', 'sound' or null
  const [surrendered, setSurrendered] = useState(false);

  const { 
    gameState, 
    makeHumanMove, 
    reset, 
    isCpuTurn, 
    isCpuDropping, 
    cpuDroppingCol,
    shouldShowPostVideoOverlay,
    setShouldShowPostVideoOverlay,
    closePostVideoOverlay
  } = useConnect4CPU();

  const { board, currentPlayer, winner, isDraw } = gameState;

  useEffect(() => {
    if (winner) {
      if (winner === PLAYER1) {
        soundManager.playWinSound();
      } else {
        soundManager.playLoseSound();
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
    navigate("/play-offline");
  };

  const handleReset = () => {
    soundManager?.playSound('coinsfalling');
    setSurrendered(false);
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
      <GiveUpButton 
        onGiveUp={() => {
          if (monkeyAnimationEnabled) {
            // After video ends, show the minimalistic result card
            setSurrendered(true);
          } else {
            // Show the crazy/chaotic overlay
            setShouldShowPostVideoOverlay(true);
          }
        }} 
        soundManager={soundManager} 
      />
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => {
            soundManager?.playClickSound();
            navigate("/home");
          }}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>vs CPU</span>
          </AppLogo>
        </HeaderContent>
      </Header>

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
            <Button variant="secondary" fullWidth onClick={handleReset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>
        </GameLayout>
      </MainContent>

      {/* Human Win/Draw/CPU Win/Surrender Overlay */}
      {(winner || isDraw || surrendered) && (
        <MatchResultOverlay 
          title={
            surrendered ? "SURRENDER" :
            winner === PLAYER1 ? "VICTORY" : 
            winner === PLAYER2 ? "DEFEAT" :
            "DRAW"
          }
          subtitle={
            surrendered ? "You've conceded to the machine. Better luck next time!" :
            winner === PLAYER1 ? "You outsmarted the machine!" : 
            winner === PLAYER2 ? "The CPU has claimed this victory." :
            "A tactical stalemate."
          }
          variant={isDraw ? "draw" : winner === PLAYER1 ? "win" : "loss"}
          icon={surrendered ? "🏳️" : winner === PLAYER1 ? "🏆" : winner === PLAYER2 ? "😔" : "🤝"}
          onPrimaryAction={handleReset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/play-offline")}
          soundManager={soundManager}
          isNaturalEnding={!surrendered}
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