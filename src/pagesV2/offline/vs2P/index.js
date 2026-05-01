import React, { useEffect, useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import useSoundManager from "../../../hooks/core/useSoundManager";
import { useConnect4 } from "../../../hooks/core/useConnect4";
import { PLAYER1, PLAYER2 } from "../../../helperFunction/helperFunction";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../../components/designSystem/Layout.style";
import Button from "../../../components/designSystem/Button";
import Scoreboard from "../../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../../components/designSystem/Status";
import Modal from "../../../components/designSystem/Modal";
import BackButton from "../../../components/designSystem/BackButton";
import GiveUpButton from "../../../components/designSystem/GiveUpButton";
import PoopBlockIndicator from "../../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import { GameLayout, ControlGroup } from "./index.style";

// Original Logic Components
import Board from "../../../components/organisms/boardStyles";
import VideoButton from "../../../components/designSystem/VideoButton";

const Game2PV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'fun', 'sound' or null
  const [surrendered, setSurrendered] = useState(null); // PLAYER1 or PLAYER2
  const { gameState, makeMove, reset: baseReset } = useConnect4();
  const { board, currentPlayer, winner, isDraw } = gameState;

  const reset = () => {
    setSurrendered(null);
    baseReset();
  };

  const handleSurrender = () => {
    // Current player surrenders, other player wins
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
      <BackButton soundManager={soundManager} />
      <GiveUpButton onGiveUp={handleSurrender} soundManager={soundManager} />
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => navigate("/home")}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', marginfontWeight: 400 }}>2 Players</span>
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
            PoopBlockIndicatorComponent={PoopBlockIndicator}
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
            surrendered ? `${surrendered === PLAYER1 ? "Player 1" : "Player 2"} has conceded.` :
            winner ? `${winner === PLAYER1 ? "Player 1" : "Player 2"} has claimed the board!` : 
            "No winner this time."
          }
          variant={isDraw ? "draw" : "win"}
          icon={surrendered ? "🏳️" : winner ? "🏆" : "🤝"}
          onPrimaryAction={reset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/play-offline")}
          soundManager={soundManager}
        />
      )}

    </PageWrapper>
  );
};

export default Game2PV2;