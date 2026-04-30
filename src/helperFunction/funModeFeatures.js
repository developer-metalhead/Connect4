import { ROWS, COLS, EMPTY } from "./helperFunction";

// Monkey Mayhem voice lines
const MONKEY_VOICE_LINES = [
  "Time to flip things up!",
  "Ooo-ooo! Gravity is my playground!",
  "Board go brrr!",
  "Monkey business time!",
  "Let's turn this upside down!",
];

// Check for separate 3-in-a-rows (non-overlapping)
export const countSeparateThreeInARows = (board, player) => {
  const usedCells = new Set();
  let count = 0;

  // Check all directions: horizontal, vertical, diagonal down-right, diagonal up-right
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== player) continue;

      for (const [dr, dc] of directions) {
        // Check if we can form a 3-in-a-row starting from this position
        const cells = [];
        let valid = true;

        for (let i = 0; i < 3; i++) {
          const r = row + i * dr;
          const c = col + i * dc;

          if (
            r < 0 ||
            r >= ROWS ||
            c < 0 ||
            c >= COLS ||
            board[r][c] !== player
          ) {
            valid = false;
            break;
          }

          const cellKey = `${r},${c}`;
          if (usedCells.has(cellKey)) {
            valid = false;
            break;
          }

          cells.push(cellKey);
        }

        if (valid) {
          // Mark these cells as used
          cells.forEach((cell) => usedCells.add(cell));
          count++;
        }
      }
    }
  }

  return count;
};

// Check if Monkey Mayhem should trigger
export const shouldTriggerMonkeyMayhem = (board, player, usedMonkeyMayhem) => {
  if (usedMonkeyMayhem.has(player)) return false;

  const threeInARowCount = countSeparateThreeInARows(board, player);
  return threeInARowCount >= 1;
};

// Flip board upside down (gravity reversal)
export const flipBoardUpsideDown = (board) => {
  const newBoard = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(EMPTY));

  // For each column, collect all non-empty pieces and drop them from the new "top"
  for (let col = 0; col < COLS; col++) {
    const pieces = [];

    // Collect pieces from bottom to top (original gravity)
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] !== EMPTY) {
        pieces.push(board[row][col]);
      }
    }

    // Drop pieces from new top (flipped gravity)
    for (let i = 0; i < pieces.length; i++) {
      newBoard[i][col] = pieces[i];
    }
  }

  return newBoard;
};

// Randomly remove one disc during monkey flip (10% chance)
export const maybeStealDisc = (board) => {
  //   if (Math.random() > 0.1) return board; // 90% chance no steal

  const occupiedCells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== EMPTY) {
        occupiedCells.push({ row, col });
      }
    }
  }

  if (occupiedCells.length === 0) return board;

  const randomCell =
    occupiedCells[Math.floor(Math.random() * occupiedCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[randomCell.row][randomCell.col] = EMPTY;

  // Apply gravity to the affected column
  const pieces = [];
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][randomCell.col] !== EMPTY) {
      pieces.push(newBoard[row][randomCell.col]);
      newBoard[row][randomCell.col] = EMPTY;
    }
  }

  // Re-drop pieces
  for (let i = 0; i < pieces.length; i++) {
    newBoard[ROWS - 1 - i][randomCell.col] = pieces[i];
  }

  return newBoard;
};

// Get random monkey voice line
export const getRandomMonkeyVoiceLine = () => {
  return MONKEY_VOICE_LINES[
    Math.floor(Math.random() * MONKEY_VOICE_LINES.length)
  ];
};

// Check if game is won during upside-down mode
export const isMonkeyWinner = (winner, isUpsideDown) => {
  return winner && isUpsideDown;
};
