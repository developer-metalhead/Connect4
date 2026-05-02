import { ROWS, COLS } from "../../logic/constants";

/**
 * PATTERN DETECTORS
 * Neutral library of algorithms to find patterns on the board.
 */

// General pattern counting function (decoupled from "3-in-a-row")
export const countSeparateInARows = (board, player, size) => {
  let count = 0;
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== player) continue;
      for (let [dr, dc] of directions) {
        let valid = true;
        for (let i = 0; i < size; i++) {
          const r = row + i * dr;
          const c = col + i * dc;
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) {
            valid = false;
            break;
          }
        }
        if (valid) count++;
      }
    }
  }
  return count;
};

// Improved Square Detection Function (Decoupled size)
export const detectNewSquares = (board, player, lastRow, lastCol, size) => {
  if (lastRow === -1 || lastCol === -1) return { count: 0, squares: [] };
  const squares = [];
  const ROWS = board.length;
  const COLS = board[0].length;
  
  for (let rOffset = -(size - 1); rOffset <= 0; rOffset++) {
    for (let cOffset = -(size - 1); cOffset <= 0; cOffset++) {
      const r = lastRow + rOffset;
      const c = lastCol + cOffset;
      if (r >= 0 && r + size <= ROWS && c >= 0 && c + size <= COLS) {
        let isSquare = true;
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (board[r + i][c + j] !== player) {
              isSquare = false;
              break;
            }
          }
          if (!isSquare) break;
        }
        if (isSquare) {
          squares.push({ startRow: r, startCol: c });
        }
      }
    }
  }
  return { count: squares.length, squares };
};
