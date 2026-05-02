import { CORE_CONFIG, PLAYERS, ANIMATION_CONFIG } from "../coreConfig";

const { EMPTY } = PLAYERS;

/**
 * Creates a fresh empty board array based on specific dimensions
 */
export const createEmptyBoard = (rows = 6, cols = 7) => {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill(EMPTY));
};

/**
 * Validates if a move is allowed in a specific column
 */
export const isValidMove = (board, col) => {
  if (col < 0 || col >= board[0].length) return false;
  return board[0][col] === EMPTY;
};

/**
 * Core win detection logic. Returns winning line coordinates or null.
 */
export const checkWin = (board, row, col, player, winLength = 4) => {
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal \
    [1, -1],  // Diagonal /
  ];

  for (let [dr, dc] of directions) {
    let count = 1;
    let winningLine = [{ row, col }];

    // Positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
      count++;
      winningLine.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    // Negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
      count++;
      winningLine.push({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (count >= winLength) return winningLine;
  }
  return null;
};

/**
 * Checks if the board is completely full
 */
export const isBoardFull = (board) => {
  return board[0].every(cell => cell !== EMPTY);
};

/**
 * Returns the next player in sequence
 */
export const getNextPlayer = (currentPlayer) => {
  return currentPlayer === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1;
};

/**
 * Returns the logical target row for a drop in a specific column
 */
export const getTargetRow = (board, col) => {
  const rows = board.length;
  for (let r = rows - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return -1;
};

/**
 * Executes a piece drop.
 */
export const dropPiece = (board, col, player) => {
  const row = getTargetRow(board, col);
  
  if (row === -1) {
    return { newBoard: board, row: -1 };
  }
  
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return { newBoard, row };
};

/**
 * Formats coordinates into standard human-readable format (e.g. A6)
 */
export const formatCoords = (row, col, totalRows = 6) => {
  const columnLetter = String.fromCharCode(65 + col);
  const rowNumber = totalRows - row;
  return `${columnLetter}${rowNumber}`;
};

/**
 * Standardized drop duration calculation
 */
export const calculateDropDuration = (distance) => {
  return ANIMATION_CONFIG.DROP_BASE_DURATION + (distance * ANIMATION_CONFIG.DROP_PER_ROW_ADDITION);
};
