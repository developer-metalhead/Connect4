import { 
  isValidMove, 
  dropPiece, 
  checkWin, 
  isBoardFull, 
  getNextPlayer,
  createEmptyBoard 
} from "./core/engine";
import { CORE_CONFIG } from "./coreConfig";

/**
 * The "Single Source of Truth" for game state transitions.
 * Given a current state and a move, it calculates the next state.
 */
export const processMove = (gameState, col) => {
  const { board, currentPlayer, winner, isDraw } = gameState;

  // 1. Validation
  if (winner || isDraw || !isValidMove(board, col)) {
    return { ...gameState, moveValid: false };
  }

  // 2. Execute Move
  const { newBoard, row } = dropPiece(board, col, currentPlayer);
  
  // 3. Analyze Result
  const winResult = checkWin(newBoard, row, col, currentPlayer);
  
  let nextState = {
    ...gameState,
    board: newBoard,
    moveValid: true,
    lastMove: { row, col, player: currentPlayer }
  };

  if (winResult) {
    nextState.winner = currentPlayer;
    nextState.winningLine = winResult;
  } else if (isBoardFull(newBoard)) {
    nextState.isDraw = true;
  } else {
    nextState.currentPlayer = getNextPlayer(currentPlayer);
  }

  return nextState;
};

/**
 * Creates a brand new game state
 */
export const createInitialState = () => ({
  board: createEmptyBoard(),
  currentPlayer: CORE_CONFIG.DEFAULT_FIRST_PLAYER,
  winner: null,
  winningLine: null,
  isDraw: false,
  lastMove: null,
});
