import { ROWS, COLS, EMPTY, PLAYER1, PLAYER2, ANIMATION_CONFIG } from "./constants";

/**
 * Standardized drop duration calculation
 */
export const calculateDropDuration = (distance) => {
  return ANIMATION_CONFIG.DROP_BASE_DURATION + (distance * ANIMATION_CONFIG.DROP_PER_ROW_ADDITION);
};

/**
 * Creates a fresh empty board array
 */
export const createEmptyBoard = () => {
  return Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(EMPTY));
};

/**
 * Validates if a move is allowed in the given column
 */
export const isValidMove = (board, col) => {
  return col >= 0 && col < COLS && board[0][col] === EMPTY;
};

/**
 * Returns all currently valid column indices for moves
 */
export const getValidMoves = (board) => {
  const moves = [];
  for (let c = 0; c < COLS; c++) {
    if (isValidMove(board, c)) moves.push(c);
  }
  return moves;
};

/**
 * Core win detection logic. Returns winning line coordinates or null.
 * Pure function: Does not mutate the board.
 */
export const checkWin = (board, row, col, player) => {
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
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      winningLine.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    // Negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      winningLine.push({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (count >= 4) return winningLine;
  }
  return null;
};

/**
 * Scans the entire board for a win. 
 * Use this when the last move coordinates are unknown (e.g. state restoration).
 */
export const scanForWin = (board) => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (player !== EMPTY) {
        const line = checkWin(board, r, c, player);
        if (line) return { winner: player, line };
      }
    }
  }
  return null;
};

/**
 * Checks if the board is completely full
 */
export const isBoardFull = (board) => {
  return board[0].every((cell) => cell !== EMPTY);
};

/**
 * Returns the next player in sequence
 */
export const getNextPlayer = (currentPlayer) => {
  return currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
};

/**
 * Returns the logical target row for a piece dropped in a column,
 * considering gravity direction.
 */
export const getTargetRow = (board, col, gravity = "normal") => {
  if (gravity === "inverted") {
    for (let r = 0; r < ROWS; r++) {
      if (board[r][col] === EMPTY) return r;
    }
  } else {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) return r;
    }
  }
  return -1;
};

/**
 * Formats coordinates into standard human-readable format (e.g. "A1", "G6")
 */
export const formatCoords = (row, col) => {
  const columnLetter = String.fromCharCode(65 + col);
  const rowNumber = ROWS - row;
  return `${columnLetter}${rowNumber}`;
};
