/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSoundManager from "../../../hooks/core/useSoundManager";
import useConnect4CPU from "../../../hooks/gameplay/useConnect4CPU";
import { useGameSettings } from "../../../hooks/core/useGameSettings";
import { useCPUSettings } from "../../../hooks/core/useCPUSettings";
import { PLAYER1, PLAYER2 } from "../../../logic/core/coreConfig";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../../components/designSystem/Layout.style";
import Button from "../../../components/designSystem/Button";
import Scoreboard from "../../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../../components/designSystem/Status";
import { GameLayout, ControlGroup, DifficultyContainer, DifficultyButton, SlidingPill } from "./index.style";

// Original Logic Components
import Board from "../../../components/organisms/boardStyles";
import PostVideoOverlay from "../../../components/designSystem/PostVideoOverlay";
import PoopBlockIndicator from "../../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import GiveUpButton from "../../../components/designSystem/GiveUpButton";
import { PLAYERS } from "../../../logic/core/coreConfig";

const PlayCPUV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const { monkeyAnimationEnabled } = useGameSettings();
  const { difficulty, seriousCPU, saveDifficulty } = useCPUSettings();
  const [surrendered, setSurrendered] = useState(false);

  const levels = ['Novice', 'Skilled', 'Expert'];
  const activeIndex = levels.indexOf(difficulty);

  const { 
    gameState, 
    makeHumanMove, 
    reset, 
    isCpuTurn, 
    isCpuThinking,
    cpuPreviewCol,
    isCpuDropping, 
    cpuDroppingCol,
    shouldShowPostVideoOverlay,
    setShouldShowPostVideoOverlay,
    closePostVideoOverlay
  } = useConnect4CPU(difficulty);

  const { board, currentPlayer, winner, isDraw } = gameState;

  // Background music management
  useEffect(() => {
    soundManager.pauseBackgroundMusic();
    return () => soundManager.resumeBackgroundMusic();
  }, [soundManager]);

  useEffect(() => {
    if (winner) {
      if (winner === PLAYERS.P1) {
        soundManager.playWinSound();
      } else {
        soundManager.playLoseSound();
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  const handleClosePostVideoOverlay = () => {
    closePostVideoOverlay();
    setSurrendered(true);
    soundManager.playSurrenderSound();
  };

  const handleReset = () => {
    soundManager?.playSound('coinsfalling');
    setSurrendered(false);
    reset();
  };

  const handleDifficultyChange = (newDifficulty) => {
    soundManager?.playClickSound();
    saveDifficulty(newDifficulty);
    handleReset();
  };

  // Scoreboard data
  const p1Data = useMemo(() => ({
    name: "Player",
    score: gameState.scores?.[PLAYERS.P1] || 0,
    active: currentPlayer === PLAYERS.P1 && !winner && !isDraw,
    emoji: PLAYERS.P1
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  const p2Data = useMemo(() => ({
    name: "CPU",
    score: gameState.scores?.[PLAYERS.P2] || 0,
    active: currentPlayer === PLAYERS.P2 && !winner && !isDraw,
    emoji: PLAYERS.P2
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  return (
    <PageWrapper>
      <GiveUpButton 
        seriousCPU={seriousCPU}
        onGiveUp={() => {
          if (seriousCPU || monkeyAnimationEnabled) {
            setSurrendered(true);
            soundManager.playSurrenderSound();
          } else {
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

          <DifficultyContainer>
            <SlidingPill activeIndex={activeIndex} />
            {levels.map((level) => (
              <DifficultyButton 
                key={level}
                active={difficulty === level}
                onClick={() => handleDifficultyChange(level)}
              >
                {level}
              </DifficultyButton>
            ))}
          </DifficultyContainer>

          <Board
            board={board}
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            onDrop={makeHumanMove}
            canInteract={!isCpuTurn && !isCpuThinking}
            soundManager={soundManager}
            isCpuThinking={isCpuThinking}
            cpuPreviewCol={cpuPreviewCol}
            isCpuDropping={isCpuDropping}
            cpuDroppingCol={cpuDroppingCol}
            winningLine={gameState.winningLine}
            PoopBlockIndicatorComponent={PoopBlockIndicator}
          />

          <GameStatus 
            message={
              winner 
                ? (winner === PLAYERS.P1 ? "You Win!" : "CPU Wins!") 
                : isDraw 
                ? "It's a Draw!" 
                : isCpuTurn 
                ? "CPU is thinking..." 
                : "Your Turn"
            }
            currentPlayerColor={currentPlayer === PLAYERS.P1 ? "red" : "yellow"}
          />

          <ControlGroup>
            <Button variant="secondary" fullWidth onClick={handleReset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>
        </GameLayout>
      </MainContent>

      {(winner || isDraw || surrendered) && (
        <MatchResultOverlay 
          title={
            surrendered ? "SURRENDER" :
            winner === PLAYERS.P1 ? "VICTORY" : 
            winner === PLAYERS.P2 ? "DEFEAT" :
            "DRAW"
          }
          subtitle={
            surrendered ? "You've conceded to the machine." :
            winner === PLAYERS.P1 ? "You outsmarted the machine!" : 
            winner === PLAYERS.P2 ? "The CPU has claimed this victory." :
            "A tactical stalemate."
          }
          variant={isDraw ? "draw" : winner === PLAYERS.P1 ? "win" : "loss"}
          icon={surrendered ? "🏳️" : winner === PLAYERS.P1 ? "🏆" : winner === PLAYERS.P2 ? "😔" : "🤝"}
          onPrimaryAction={handleReset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/play-offline")}
          soundManager={soundManager}
          isNaturalEnding={!surrendered}
        />
      )}

      <PostVideoOverlay
        isVisible={shouldShowPostVideoOverlay}
        onClose={handleClosePostVideoOverlay}
        soundManager={soundManager}
      />
    </PageWrapper>
  );
};

export default PlayCPUV2;