// Game logic (same emoji as client)
const ROWS = 6;
const COLS = 7;
const PLAYER1 = "🔴";
const PLAYER2 = "🟡";
const EMPTY = "⚪";

const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));

const resetState = () => ({
  board: createEmptyBoard(),
  currentPlayer: PLAYER1,
  winner: null,
  isDraw: false,
});

const dropPiece = (board, col, player) => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === EMPTY) {
      const newBoard = board.map((r) => r.slice());
      newBoard[row][col] = player;
      return { newBoard, row };
    }
  }
  return { newBoard: board, row: -1 };
};

const isValidMove = (board, col) => col >= 0 && col < COLS && board[0][col] === EMPTY;

const checkWin = (board, row, col, player) => {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (const [dr, dc] of dirs) {
    let cnt = 1;
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) { cnt++; r += dr; c += dc; }
    r = row - dr; c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) { cnt++; r -= dr; c -= dc; }
    if (cnt >= 4) return true;
  }
  return false;
};

const isBoardFull = (board) => board[0].every((x) => x !== EMPTY);
const nextPlayer = (p) => (p === PLAYER1 ? PLAYER2 : PLAYER1);

module.exports = {
  ROWS, COLS, PLAYER1, PLAYER2, EMPTY,
  createEmptyBoard, resetState, dropPiece, isValidMove, checkWin, isBoardFull, nextPlayer,
};