/**
 * HELPER FUNCTIONS (Compatibility Layer)
 * This file acts as a bridge, re-exporting constants and engine logic
 * so that legacy components and hooks continue to work correctly.
 */

import { PLAYER1 } from "../logic/core/constants";
import { createEmptyBoard, getTargetRow } from "../logic/core/engine";

// Re-export constants
export { 
  ROWS, 
  COLS, 
  PLAYER1, 
  PLAYER2, 
  EMPTY,
  ANIMATION_CONFIG 
} from "../logic/core/constants";

// Re-export core engine logic
export {
  createEmptyBoard,
  isValidMove,
  checkWin,
  isBoardFull,
  getNextPlayer,
  formatCoords,
  getTargetRow,
  calculateDropDuration
} from "../logic/core/engine";

/**
 * Drop a piece into the board (Legacy wrapper)
 */
export const dropPiece = (board, col, player) => {
  const row = getTargetRow(board, col);
  if (row === -1) return { newBoard: board, row: -1 };
  
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return { newBoard, row };
};

/**
 * Reset game state (Legacy wrapper)
 */
export const resetGame = () => {
  return {
    board: createEmptyBoard(),
    currentPlayer: PLAYER1,
    winner: null,
    winningLine: null,
    isDraw: false,
  };
};
