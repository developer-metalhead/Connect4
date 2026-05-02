import { 
  isValidMove, 
  dropPiece, 
  checkWin, 
  isBoardFull, 
  getNextPlayer,
  createEmptyBoard 
} from "./engine";
import { CORE_CONFIG,PLAYERS } from "./coreConfig";
/**
 * Pure Game State Transition Logic
 * Now correctly importing from its new neighbors in the /core folder.
 */
export const processMove = (gameState, col) => {
  const { board, currentPlayer, winner, isDraw } = gameState;
  const { WIN_LENGTH } = CORE_CONFIG;

  // 1. Validation
  if (winner || isDraw || !isValidMove(board, col)) {
    return { ...gameState, moveValid: false };
  }

  // 2. Execute Move
  const { newBoard, row } = dropPiece(board, col, currentPlayer);
  
  // 3. Analyze Result
  const winResult = checkWin(newBoard, row, col, currentPlayer, WIN_LENGTH);
  
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
 * Creates the initial state for a standard game
 */
export const createInitialState = () => {
  const { ROWS, COLS, DEFAULT_FIRST_PLAYER } = CORE_CONFIG;
  
  return {
    board: createEmptyBoard(ROWS, COLS),
    currentPlayer: DEFAULT_FIRST_PLAYER,
    winner: null,
    winningLine: null,
    isDraw: false,
    lastMove: null
  };
};
