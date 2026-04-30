import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CustomButton from "../../../components/organisms/buttonComponent";
import Status from "../../../components/organisms/status";
import Board from "../../../components/organisms/boardStyles";
import useSoundManager from "../../../hooks/core/useSoundManager";

import { useConnect4 } from "../../../hooks/core/useConnect4";
import {
  PageContainer,
  HeaderContainer,
  BodyContainer,
  ButtonContainer,
} from "./index.style";
import BoredVideoButton from "../../../components/organisms/VideoButton";

const Game2P = () => {
  const navigate = useNavigate();
  const { gameState, makeMove, reset } = useConnect4();
  const { board, currentPlayer, winner, isDraw } = gameState;
  const soundManager = useSoundManager();

  // Play win/lose/draw sounds when game ends
  useEffect(() => {
    if (winner) {
      soundManager.playWinSound();
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>2 Players Mode</BodyContainer>

      <Status
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
        playerNames={{ "🔴": "Player 1", "🟡": "Player 2" }}
      />

      <Board
        board={board}
        currentPlayer={currentPlayer}
        winner={winner}
        isDraw={isDraw}
        onDrop={makeMove}
        soundManager={soundManager}
      />

      <ButtonContainer>
        <CustomButton onClick={reset} soundManager={soundManager}>
          New Game
        </CustomButton>
        <CustomButton
          onClick={() => navigate("/play-offline")}
          soundManager={soundManager}
        >
          Back to Menu
        </CustomButton>
        <BoredVideoButton onGameReset={reset}>
          Extremely Fun Button!
        </BoredVideoButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default Game2P;