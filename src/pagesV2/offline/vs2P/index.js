import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../../hooks/core/useSoundManager";
import { useConnect4 } from "../../../hooks/core/useConnect4";
import { PLAYER1, PLAYER2 } from "../../../helperFunction/helperFunction";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../../components/designSystem/Layout.style";
import Button from "../../../components/designSystem/Button";
import Scoreboard from "../../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../../components/designSystem/Status";
import { GameLayout, ControlGroup } from "./index.style";

// Original Logic Components
import Board from "../../../components/organisms/boardStyles";
import BoredVideoButton from "../../../components/organisms/VideoButton";

const Game2PV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const { gameState, makeMove, reset } = useConnect4();
  const { board, currentPlayer, winner, isDraw } = gameState;

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
    score: gameState.scores?.[PLAYER1] || 0,
    active: currentPlayer === PLAYER1 && !winner && !isDraw,
    emoji: PLAYER1
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  const p2Data = useMemo(() => ({
    name: "Player 2",
    score: gameState.scores?.[PLAYER2] || 0,
    active: currentPlayer === PLAYER2 && !winner && !isDraw,
    emoji: PLAYER2
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  return (
    <PageWrapper>
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => navigate("/v2")}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>2 Players</span>
          </AppLogo>
          <Button variant="outline" size="sm" onClick={() => navigate("/v2/play-offline")} soundManager={soundManager}>
            Exit
          </Button>
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
                ? `${winner === PLAYER1 ? "Player 1" : "Player 2"} Wins!` 
                : isDraw 
                ? "It's a Draw!" 
                : `${currentPlayer === PLAYER1 ? "Player 1" : "Player 2"}'s Turn`
            }
            currentPlayerColor={currentPlayer === PLAYER1 ? "red" : "yellow"}
          />

          <ControlGroup>
            <BoredVideoButton onGameReset={reset}>
               <Button variant="danger" fullWidth soundManager={soundManager}>Give Up!</Button>
            </BoredVideoButton>
            <Button variant="secondary" fullWidth onClick={reset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>
        </GameLayout>
      </MainContent>

      {(winner || isDraw) && (
        <MatchResultOverlay 
          title={winner ? "VICTORY" : "DRAW"}
          subtitle={winner ? `${winner === PLAYER1 ? "Player 1" : "Player 2"} has claimed the board!` : "No winner this time."}
          variant={winner ? "win" : "draw"}
          onPrimaryAction={reset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/v2")}
          soundManager={soundManager}
        />
      )}
    </PageWrapper>
  );
};

export default Game2PV2;