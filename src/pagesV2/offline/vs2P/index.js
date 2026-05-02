import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../../hooks/core/useSoundManager";
import { useConnect4 } from "../../../hooks/gameplay/useConnect4";
import { PLAYERS } from "../../../logic/core/coreConfig";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../../components/designSystem/Layout.style";
import Button from "../../../components/designSystem/Button";
import Scoreboard from "../../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../../components/designSystem/Status";
import BackButton from "../../../components/designSystem/BackButton";
import GiveUpButton from "../../../components/designSystem/GiveUpButton";
import { GameLayout, ControlGroup } from "./index.style";

// Original Logic Components
import Board from "../../../components/organisms/boardStyles";

const Game2PV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const [surrendered, setSurrendered] = useState(null); // PLAYER1 or PLAYER2
  const { gameState, makeMove, reset: baseReset } = useConnect4();
  const { board, currentPlayer, winner, isDraw } = gameState;

  // Background music management
  useEffect(() => {
    soundManager.pauseBackgroundMusic();
    return () => soundManager.resumeBackgroundMusic();
  }, [soundManager]);

  const reset = () => {
    soundManager?.playClickSound();
    setSurrendered(null);
    baseReset();
  };

  const handleSurrender = () => {
    soundManager.playSurrenderSound();
    setSurrendered(currentPlayer);
  };

  useEffect(() => {
    if (winner) {
      soundManager.playWinSound();
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  // Scoreboard data
  const p1Data = useMemo(() => ({
    name: "Player 1",
    score: gameState.scores?.[PLAYERS.P1] || 0,
    active: currentPlayer === PLAYERS.P1 && !winner && !isDraw,
    emoji: PLAYERS.P1
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  const p2Data = useMemo(() => ({
    name: "Player 2",
    score: gameState.scores?.[PLAYERS.P2] || 0,
    active: currentPlayer === PLAYERS.P2 && !winner && !isDraw,
    emoji: PLAYERS.P2
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  return (
    <PageWrapper>
      <GiveUpButton onGiveUp={handleSurrender} soundManager={soundManager} />
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => {
            soundManager?.playClickSound();
            navigate("/home");
          }}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>2 Players</span>
          </AppLogo>
        </HeaderContent>
      </Header>

      <MainContent>
        <GameLayout>
          <Scoreboard p1={p1Data} p2={p2Data} />

          <Board
            board={board}
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            onDrop={makeMove}
            soundManager={soundManager}
            winningLine={gameState.winningLine}
          />

          <GameStatus 
            message={
              winner 
                ? `${winner === PLAYERS.P1 ? "Player 1" : "Player 2"} Wins!` 
                : isDraw 
                ? "It's a Draw!" 
                : `${currentPlayer === PLAYERS.P1 ? "Player 1" : "Player 2"}'s Turn`
            }
            currentPlayerColor={currentPlayer === PLAYERS.P1 ? "red" : "yellow"}
          />

          <ControlGroup>
            <Button variant="secondary" fullWidth onClick={reset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>
        </GameLayout>
      </MainContent>

      {(winner || isDraw || surrendered) && (
        <MatchResultOverlay 
          title={
            surrendered ? "SURRENDER" :
            winner ? "VICTORY" : 
            "DRAW"
          }
          subtitle={
            surrendered ? `${surrendered === PLAYERS.P1 ? "Player 1" : "Player 2"} has conceded.` :
            winner ? `${winner === PLAYERS.P1 ? "Player 1" : "Player 2"} has claimed the board!` : 
            "No winner this time."
          }
          variant={isDraw ? "draw" : "win"}
          icon={surrendered ? "🏳️" : winner ? "🏆" : "🤝"}
          onPrimaryAction={reset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/play-offline")}
          soundManager={soundManager}
          isNaturalEnding={!surrendered}
        />
      )}
    </PageWrapper>
  );
};

export default Game2PV2;