const ROWS = 6;
const COLS = 7;
const PLAYER1 = "🔴";
const PLAYER2 = "🟡";
const EMPTY = "⚪";

// Create empty board
export const createEmptyBoard = () => {
  return Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(EMPTY));
};

// Reset game (returns initial state)
export const resetGame = () => {
  return {
    board: createEmptyBoard(),
    currentPlayer: PLAYER1,
    winner: null,
    winningLine: null,
    isDraw: false,
  };
};

// Drop piece in column
export const dropPiece = (board, col, player) => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === EMPTY) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      return { newBoard, row };
    }
  }
  return { newBoard: board, row: -1 }; // Column full
};

// Check valid move
export const isValidMove = (board, col) => {
  return col >= 0 && col < COLS && board[0][col] === EMPTY;
};

// CHANGE: Added upside-down mode parameter to check win function
export const checkWin = (board, row, col, player, isUpsideDown = false) => {
  const directions = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonal \
    [1, -1], // Diagonal /
  ];

  for (let [dr, dc] of directions) {
    let count = 1;
    let winningLine = [{ row, col }];

    // Positive direction
    let r = row + dr,
      c = col + dc;
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

// Check draw
export const isBoardFull = (board) => {
  return board[0].every((cell) => cell !== EMPTY);
};

export const getNextPlayer = (player) =>
  player === PLAYER1 ? PLAYER2 : PLAYER1;

export { ROWS, COLS, PLAYER1, PLAYER2, EMPTY };
