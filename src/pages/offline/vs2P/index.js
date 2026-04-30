import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/buttonComponent";
import Status from "../../../components/status";
import Board from "../../../components/boardStyles";

import { useConnect4 } from "../../../hooks/useConnect4";
import {
  PageContainer,
  HeaderContainer,
  BodyContainer,
  ButtonContainer,
} from "./index.style";

const Game2P = () => {
  const navigate = useNavigate();
  const { gameState, makeMove, reset } = useConnect4();
  const { board, currentPlayer, winner, isDraw } = gameState;

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
      />

      <ButtonContainer>
        <CustomButton onClick={reset}>New Game</CustomButton>
        <CustomButton onClick={() => navigate("/play-offline")}>
          Back to Menu
        </CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default Game2P;
