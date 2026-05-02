import { 
  ROWS, 
  COLS, 
  PLAYER1, 
  PLAYER2, 
  EMPTY 
} from "../logic/constants";

import {
  createEmptyBoard,
  isValidMove,
  checkWin,
  isBoardFull,
  getNextPlayer,
  formatCoords,
  getTargetRow
} from "../logic/engine";

// Legacy wrapper for dropPiece used by older hooks
export const dropPiece = (board, col, player) => {
  const row = getTargetRow(board, col);
  if (row === -1) return { newBoard: board, row: -1 };
  
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return { newBoard, row };
};

// Reset game state
export const resetGame = () => {
  return {
    board: createEmptyBoard(),
    currentPlayer: PLAYER1,
    winner: null,
    winningLine: null,
    isDraw: false,
  };
};

export { 
  ROWS, 
  COLS, 
  PLAYER1, 
  PLAYER2, 
  EMPTY,
  createEmptyBoard,
  isValidMove,
  checkWin,
  isBoardFull,
  getNextPlayer,
  formatCoords
};
