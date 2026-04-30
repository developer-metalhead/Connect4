/* eslint-disable no-unused-vars */
import CustomButton from "../../../components/buttonComponent";
import { useState } from "react";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";
import {
  checkWin,
  dropPiece,
  isBoardFull,
  isValidMove,
  PLAYER1,
  PLAYER2,
  resetGame,
} from "../../../helperFunction/helperFunction";
import Status from "../../../components/status";
import { BoardContainer, Cell, Row } from "../../../components/boardStyles";
import { useNavigate } from "react-router-dom";

const Player = () => {
  // Initialize using resetGame helper
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(resetGame);

  const { board, currentPlayer, winner, isDraw } = gameState;

  const handleDrop = (col) => {
    if (winner || isDraw || !isValidMove(board, col)) return;

    const { newBoard, row } = dropPiece(board, col, currentPlayer);

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        winner: currentPlayer,
      }));
    } else if (isBoardFull(newBoard)) {
      setGameState((prev) => ({ ...prev, board: newBoard, isDraw: true }));
    } else {
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1,
      }));
    }
  };

  const handleReset = () => {
    setGameState(resetGame());
  };

  return (
    <PageContainer>
      <HeaderContainer>Connect 4 </HeaderContainer>
      <BodyContainer>2 Players</BodyContainer>
      <Status winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} />
      <BoardContainer>
        {board.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((cell, colIndex) => (
              <Cell key={colIndex} onClick={() => handleDrop(colIndex)}>
                {cell}
              </Cell>
            ))}
          </Row>
        ))}
      </BoardContainer>

      <ButtonContainer>
        <CustomButton onClick={handleReset}>New Game</CustomButton>
        <CustomButton onClick={() => navigate("/play-offline")}>
          Back to Menu
        </CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default Player;
