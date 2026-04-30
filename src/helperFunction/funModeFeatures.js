import { ROWS, COLS, EMPTY } from "./helperFunction";

// Monkey Mayhem voice lines
const MONKEY_VOICE_LINES = [
  "Time to flip things up!",
  "Ooo-ooo! Gravity is my playground!",
  "Board go brrr!",
  "Monkey business time!",
  "Let's turn this upside down!",
];

// CHANGE: Completely rewritten 3-in-a-row detection with robust overlap prevention
export const countSeparateThreeInARows = (board, player) => {
  console.log("🔍 COUNTING 3-IN-A-ROWS FOR PLAYER:", player);
  console.log(
    "📋 CURRENT BOARD:",
    board.map((row) => row.join("")),
  );

  const usedCells = new Set();
  let count = 0;

  // Check all directions: horizontal, vertical, diagonal down-right, diagonal up-right

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];

  const directionNames = [
    "horizontal",
    "vertical",
    "diagonal-down-right",
    "diagonal-up-right",
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== player) continue;

      for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
        const [dr, dc] = directions[dirIndex];
        const dirName = directionNames[dirIndex];

        // CHANGE: Check if we can form a 3-in-a-row starting from this position
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
            console.log("❌ CELL ALREADY USED:", {
              cell: cellKey,
              direction: dirName,
              startPos: `${row},${col}`,
            });
            valid = false;
            break;
          }

          cells.push(cellKey);
        }

        if (valid) {
          // Mark these cells as used to prevent overlap
          cells.forEach((cell) => usedCells.add(cell));
          count++;

          console.log("✅ FOUND 3-IN-A-ROW:", {
            direction: dirName,
            startPos: `${row},${col}`,
            cells: cells,
            totalCount: count,
          });
        }
      }
    }
  }

  console.log("📊 FINAL 3-IN-A-ROW COUNT:", {
    player,
    count,
    usedCells: Array.from(usedCells),
  });

  return count;
};

// CHANGE: Lowered requirement to 1 separate 3-in-a-row for more frequent triggering
export const shouldTriggerMonkeyMayhem = (board, player, usedMonkeyMayhem) => {
  console.log("🐒 CHECKING MONKEY MAYHEM TRIGGER:", {
    player,
    hasUsedBefore: usedMonkeyMayhem.has(player),
    usedPlayers: Array.from(usedMonkeyMayhem),
  });

  if (usedMonkeyMayhem.has(player)) {
    console.log("❌ PLAYER ALREADY USED MONKEY MAYHEM:", player);
    return false;
  }

  const threeInARowCount = countSeparateThreeInARows(board, player);
  const shouldTrigger = threeInARowCount >= 1; // CHANGE: Reduced from 3 to 1 for better gameplay

  console.log("🎯 MONKEY MAYHEM DECISION:", {
    player,
    threeInARowCount,
    requiredCount: 1,
    shouldTrigger,
  });

  return shouldTrigger;
};

// CHANGE: Enhanced board flip with proper gravity reversal
export const flipBoardUpsideDown = (board) => {
  console.log("🔄 FLIPPING BOARD UPSIDE DOWN");
  console.log(
    "📋 BEFORE FLIP:",
    board.map((row) => row.join("")),
  );

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

    console.log(`📍 COLUMN ${col} PIECES:`, pieces);

    // CHANGE: Drop pieces from new top (flipped gravity) - pieces stack from top down
    for (let i = 0; i < pieces.length; i++) {
      newBoard[i][col] = pieces[i];
    }
  }

  console.log(
    "📋 AFTER FLIP:",
    newBoard.map((row) => row.join("")),
  );
  return newBoard;
};

// CHANGE: Modified disc stealing to only target opponent who didn't trigger monkey mayhem
export const maybeStealDisc = (board, triggeringPlayer) => {
  if (Math.random() > 0.5) {
    console.log("🍌 NO DISC STOLEN (50% chance)");
    return board; // 50% chance no steal
  }

  console.log("🍌 MONKEY STEALING A DISC! (50% chance)");

  // CHANGE: Only steal from the opponent who didn't trigger monkey mayhem
  const opponentPlayer = triggeringPlayer === "🔴" ? "🟡" : "🔴";

  const opponentCells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === opponentPlayer) {
        opponentCells.push({ row, col });
      }
    }
  }

  if (opponentCells.length === 0) {
    console.log("❌ NO OPPONENT DISCS TO STEAL");
    return board;
  }

  const randomCell =
    opponentCells[Math.floor(Math.random() * opponentCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[randomCell.row][randomCell.col] = EMPTY;

  console.log("🍌 STOLE DISC FROM OPPONENT:", {
    cell: randomCell,
    opponent: opponentPlayer,
    triggeredBy: triggeringPlayer,
  });

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

  console.log(
    "📋 AFTER DISC THEFT:",
    newBoard.map((row) => row.join("")),
  );
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

// CHANGE: Fixed upside-down drop logic to properly stack pieces from top to bottom
export const dropPieceUpsideDown = (board, col, player) => {
  console.log("🙃 DROPPING PIECE UPSIDE DOWN:", { col, player });
  console.log(
    "🙃 COLUMN STATE BEFORE DROP:",
    board.map((row) => row[col]),
  );

  // In upside-down mode, pieces stack from top (row 0) downward
  // Find the first empty row from top to bottom
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      console.log("✅ UPSIDE DOWN DROP SUCCESS:", { row, col, player });
      console.log(
        "🙃 COLUMN STATE AFTER DROP:",
        newBoard.map((r) => r[col]),
      );
      return { newBoard, row };
    }
  }

  console.log("❌ UPSIDE DOWN COLUMN FULL:", col);
  return { newBoard: board, row: -1 }; // Column full
};

// CHANGE: Fixed validation to check if bottom row is full in upside-down mode
export const isValidMoveUpsideDown = (board, col) => {
  if (col < 0 || col >= COLS) return false;
  // In upside-down mode, check if there's any empty space in the column
  // Since pieces stack from top, we need to check if there's any empty cell
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      return true;
    }
  }
  return false; // Column is completely full
};

// CHANGE: Fixed board full check for upside-down mode
export const isBoardFullUpsideDown = (board) => {
  // In upside-down mode, board is full when all cells are occupied
  // Check every cell in the board
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === EMPTY) {
        return false;
      }
    }
  }
  return true;
};
