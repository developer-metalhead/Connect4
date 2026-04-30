import { ROWS, COLS, EMPTY } from "../helperFunction";

// Chaos Chicken voice lines
const CHICKEN_VOICE_LINES = [
  "Bawk bawk!",
  "Cluck cluck!",
  "BWAAAAK!!!",
  "Chicken Alert!",
  "Poop incoming!",
];

const ROOSTER_VOICE_LINES = [
  "COCK-A-DOODLE-DOOM!",
  "Rooster of Rage activated!",
  "Time for destruction!",
  "FIRE AND FURY!",
];

// CHANGE: Detect 2x2 squares formed by the current player
export const detect2x2Squares = (board, player) => {
  console.log("🐔 DETECTING 2x2 SQUARES FOR PLAYER:", player);
  
  const squares = [];
  
  // Check all possible 2x2 positions
  for (let row = 0; row < ROWS - 1; row++) {
    for (let col = 0; col < COLS - 1; col++) {
      // Check if all 4 positions in the 2x2 square belong to the player
      if (
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row + 1][col] === player &&
        board[row + 1][col + 1] === player
      ) {
        squares.push({
          topLeft: { row, col },
          positions: [
            { row, col },
            { row, col: col + 1 },
            { row: row + 1, col },
            { row: row + 1, col: col + 1 }
          ]
        });
        
        console.log("✅ FOUND 2x2 SQUARE:", {
          player,
          topLeft: `${row},${col}`,
          positions: squares[squares.length - 1].positions
        });
      }
    }
  }
  
  console.log("📊 TOTAL 2x2 SQUARES FOUND:", squares.length);
  return squares;
};

// CHANGE: Check if Chaos Chicken should trigger
export const shouldTriggerChaosChicken = (board, player, chaosChickenState) => {
  console.log("🐔 CHECKING CHAOS CHICKEN TRIGGER:", {
    player,
    chaosChickenState,
  });

  const squares = detect2x2Squares(board, player);
  const shouldTrigger = squares.length > 0;

  console.log("🎯 CHAOS CHICKEN DECISION:", {
    player,
    squareCount: squares.length,
    shouldTrigger,
    activations: chaosChickenState.activations,
  });

  return shouldTrigger;
};

// CHANGE: Get available columns (not blocked by poop)
export const getAvailableColumns = (blockedColumns) => {
  const available = [];
  for (let col = 0; col < COLS; col++) {
    const blocked = blockedColumns.find(b => b.columnIndex === col);
    if (!blocked || blocked.turnsLeft <= 0) {
      available.push(col);
    }
  }
  return available;
};

// CHANGE: Block a random column with poop
export const blockRandomColumn = (blockedColumns) => {
  const availableColumns = getAvailableColumns(blockedColumns);
  
  if (availableColumns.length === 0) {
    console.log("❌ NO AVAILABLE COLUMNS TO BLOCK");
    return blockedColumns;
  }

  const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
  
  // Remove existing block for this column if any, then add new block
  const newBlockedColumns = blockedColumns.filter(b => b.columnIndex !== randomCol);
  newBlockedColumns.push({
    columnIndex: randomCol,
    turnsLeft: 4, // 2 full turns = 4 half-turns
  });

  console.log("💩 BLOCKED COLUMN:", {
    column: randomCol,
    turnsLeft: 4,
    totalBlocked: newBlockedColumns.length
  });

  return newBlockedColumns;
};

// CHANGE: Wipe an entire row (Rooster of Rage ability)
export const wipeRandomRow = (board) => {
  console.log("🔥 ROOSTER OF RAGE - WIPING RANDOM ROW");
  
  // Find rows that have at least one disc
  const occupiedRows = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== EMPTY) {
        occupiedRows.push(row);
        break;
      }
    }
  }

  if (occupiedRows.length === 0) {
    console.log("❌ NO OCCUPIED ROWS TO WIPE");
    return board;
  }

  const randomRow = occupiedRows[Math.floor(Math.random() * occupiedRows.length)];
  const newBoard = board.map((row, rowIndex) => 
    rowIndex === randomRow 
      ? Array(COLS).fill(EMPTY)
      : [...row]
  );

  console.log("🔥 WIPED ROW:", {
    row: randomRow,
    before: board[randomRow].join(""),
    after: newBoard[randomRow].join("")
  });

  // Apply gravity after row wipe
  return applyGravityAfterRowWipe(newBoard);
};

// CHANGE: Apply gravity after a row is wiped
export const applyGravityAfterRowWipe = (board) => {
  const newBoard = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(EMPTY));

  for (let col = 0; col < COLS; col++) {
    // Collect all non-empty pieces in this column
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      const piece = board[row][col];
      if (piece !== EMPTY) {
        pieces.push(piece);
      }
    }
    
    // Drop pieces to bottom
    for (let i = 0; i < pieces.length; i++) {
      newBoard[ROWS - 1 - i][col] = pieces[pieces.length - 1 - i];
    }
  }

  return newBoard;
};

// CHANGE: Decrease blocked column timers
export const decreaseBlockedColumnTimers = (blockedColumns) => {
  const updated = blockedColumns
    .map(block => ({
      ...block,
      turnsLeft: block.turnsLeft - 1
    }))
    .filter(block => block.turnsLeft > 0);

  console.log("⏰ UPDATED BLOCKED COLUMNS:", {
    before: blockedColumns.length,
    after: updated.length,
    remaining: updated
  });

  return updated;
};

// CHANGE: Check if a column is blocked
export const isColumnBlocked = (col, blockedColumns) => {
  const blocked = blockedColumns.find(b => b.columnIndex === col && b.turnsLeft > 0);
  return !!blocked;
};

// CHANGE: Get random chicken voice line
export const getRandomChickenVoiceLine = (isRooster = false) => {
  const lines = isRooster ? ROOSTER_VOICE_LINES : CHICKEN_VOICE_LINES;
  return lines[Math.floor(Math.random() * lines.length)];
};

// CHANGE: Check if column drop is valid (not blocked by poop)
export const isValidDropWithPoop = (board, col, blockedColumns, isUpsideDown = false) => {
  // First check if column is blocked by poop
  if (isColumnBlocked(col, blockedColumns)) {
    return false;
  }

  // Then check normal validity
  if (isUpsideDown) {
    // In upside-down mode, check if top row is empty
    return board[0][col] === EMPTY;
  } else {
    // In normal mode, check if top row is empty
    return board[0][col] === EMPTY;
  }
};

// CHANGE: Find next available column if current is blocked
export const findNextAvailableColumn = (board, preferredCol, blockedColumns, isUpsideDown = false) => {
  // Try preferred column first
  if (isValidDropWithPoop(board, preferredCol, blockedColumns, isUpsideDown)) {
    return preferredCol;
  }

  // Find nearest available columns
  const availableColumns = [];
  for (let col = 0; col < COLS; col++) {
    if (isValidDropWithPoop(board, col, blockedColumns, isUpsideDown)) {
      availableColumns.push(col);
    }
  }

  if (availableColumns.length === 0) {
    return -1; // No available columns
  }

  // Return closest available column to preferred
  return availableColumns.reduce((closest, current) => {
    const closestDist = Math.abs(closest - preferredCol);
    const currentDist = Math.abs(current - preferredCol);
    return currentDist < closestDist ? current : closest;
  });
};