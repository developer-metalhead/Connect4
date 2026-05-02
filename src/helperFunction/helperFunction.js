/**
 * HELPER FUNCTIONS (Compatibility Layer)
 * This file acts as a bridge, re-exporting constants and engine logic
 * so that legacy components and hooks continue to work correctly.
 */

import { createEmptyBoard } from "../logic/core/engine";
import { CORE_CONFIG } from "../logic/coreConfig";

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
  calculateDropDuration,
  dropPiece
} from "../logic/core/engine";

/**
 * Reset game state (Legacy wrapper)
 */
export const resetGame = () => {
  return {
    board: createEmptyBoard(),
    currentPlayer: CORE_CONFIG.DEFAULT_FIRST_PLAYER,
    winner: null,
    winningLine: null,
    isDraw: false,
  };
};
