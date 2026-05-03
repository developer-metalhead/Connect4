import { 
  isValidMove, 
  dropPiece, 
  checkWin, 
  isBoardFull, 
  getNextPlayer,
  createEmptyBoard 
} from "./engine";
import { CORE_CONFIG, PLAYERS, EVENTS } from "./coreConfig";
import { gameBus } from "./eventBus";
/**
 * Pure Game State Transition Logic
 * Now correctly importing from its new neighbors in the /core folder.
 */
export const processMove = (gameState, col) => {
  const { board, currentPlayer, winner, isDraw } = gameState;
  const { WIN_PATTERN } = CORE_CONFIG.MODE;

  // 1. Validation
  if (winner || isDraw || !isValidMove(board, col)) {
    return { ...gameState, moveValid: false };
  }

  // 2. Execute Move
  const { newBoard, row } = dropPiece(board, col, currentPlayer);
  
  // EMIT: Piece dropped
  gameBus.emit(EVENTS.PIECE_DROPPED, { row, col, player: currentPlayer });

  // 3. Analyze Result
  const winResult = checkWin(newBoard, row, col, currentPlayer, WIN_PATTERN);
  
  let nextState = {
    ...gameState,
    board: newBoard,
    moveValid: true,
    lastMove: { row, col, player: currentPlayer }
  };

  if (winResult) {
    nextState.winner = currentPlayer;
    nextState.winningLine = winResult;
    // EMIT: Win
    gameBus.emit(EVENTS.GAME_WIN, { winner: currentPlayer, winningLine: winResult });
  } else if (isBoardFull(newBoard)) {
    nextState.isDraw = true;
    // EMIT: Draw
    gameBus.emit(EVENTS.GAME_DRAW);
  } else {
    nextState.currentPlayer = getNextPlayer(currentPlayer);
    // EMIT: Turn Change
    gameBus.emit(EVENTS.TURN_CHANGED, { nextPlayer: nextState.currentPlayer });
  }

  return nextState;
};

/**
 * Creates the initial state for a standard game
 */
export const createInitialState = () => {
  const { ROWS, COLS } = CORE_CONFIG.MODE;
  const { DEFAULT_FIRST_PLAYER } = CORE_CONFIG;
  
  return {
    board: createEmptyBoard(ROWS, COLS),
    currentPlayer: DEFAULT_FIRST_PLAYER,
    winner: null,
    winningLine: null,
    isDraw: false,
    lastMove: null
  };
};
