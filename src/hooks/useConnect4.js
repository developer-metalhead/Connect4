import { useState, useCallback } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
} from "../helperFunction/helperFunction";

export const useConnect4 = () => {
  const [gameState, setGameState] = useState(resetGame);

  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      if (winner || isDraw || !isValidMove(board, col)) return false;

      const { newBoard, row } = dropPiece(board, col, currentPlayer);

      let newState = { ...gameState, board: newBoard };

      if (checkWin(newBoard, row, col, currentPlayer)) {
        newState.winner = currentPlayer;
      } else if (isBoardFull(newBoard)) {
        newState.isDraw = true;
      } else {
        newState.currentPlayer = getNextPlayer(currentPlayer);
      }

      setGameState(newState);
      return true;
    },
    [gameState],
  );

  const reset = useCallback(() => {
    setGameState(resetGame());
  }, []);

  return { gameState, makeMove, reset };
};
