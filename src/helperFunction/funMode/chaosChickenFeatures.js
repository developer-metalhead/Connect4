import { ROWS, COLS, EMPTY } from "../helperFunction";

// Chaos Chicken voice lines
const CHICKEN_VOICE_LINES = [
  "Bawk bawk! Chaos time!",
  "Cluck cluck! Here comes trouble!",
  "Chicken alert! Incoming poop!",
  "Feathers flying everywhere!",
  "Time to ruffle some feathers!",
];

const ROOSTER_VOICE_LINES = [
  "RAAAWR! Rooster of Rage!",
  "COCK-A-DOODLE-DOOM!",
  "Fire and fury unleashed!",
  "Behold the mighty rooster!",
  "Rage mode activated!",
];

// Improved 2x2 Detection Function (Strict)
export const detectNew2x2Squares = (board, player, lastRow, lastCol) => {
  console.log(`🔍 Checking 2x2 immediately after placement at [${lastRow}][${lastCol}]`);
  
  if (lastRow === -1 || lastCol === -1) return { count: 0, squares: [] };
  
  const squares = [];
  const ROWS = board.length;
  const COLS = board[0].length;
  
  // Check the maximum 4 possible 2x2 positions that can contain the newly placed disc:
  // Top-left, Top-right, Bottom-left, Bottom-right
  const possibleCorners = [
    { r: lastRow, c: lastCol },         // Square is to the bottom-right
    { r: lastRow, c: lastCol - 1 },     // Square is to the bottom-left
    { r: lastRow - 1, c: lastCol },     // Square is to the top-right
    { r: lastRow - 1, c: lastCol - 1 }  // Square is to the top-left
  ];
  
  for (const corner of possibleCorners) {
    const { r, c } = corner;
    
    // Bounds check
    if (r >= 0 && r < ROWS - 1 && c >= 0 && c < COLS - 1) {
      if (
        board[r][c] === player &&
        board[r][c + 1] === player &&
        board[r + 1][c] === player &&
        board[r + 1][c + 1] === player
      ) {
        squares.push({ startRow: r, startCol: c });
        console.log(`✅ Found new 2x2 at [${r}][${c}] including placed cell`);
      }
    }
  }
  
  console.log(`📊 TOTAL NEW 2x2 SQUARES: ${squares.length}`);
  if (squares.length > 0) {
    console.log(`🚀 Triggering Chaos Chicken instantly for player ${player}`);
  }
  
  return { count: squares.length, squares };
};

// Get random unblocked column
export const getRandomUnblockedColumn = (blockedColumns) => {
  const availableColumns = [];
  for (let col = 0; col < COLS; col++) {
    const blocked = blockedColumns.find(b => b.columnIndex === col && b.turnsLeft > 0);
    if (!blocked) {
      availableColumns.push(col);
    }
  }
  
  if (availableColumns.length === 0) {
    console.log("❌ NO UNBLOCKED COLUMNS AVAILABLE");
    return null;
  }
  
  const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
  console.log("🎯 SELECTED RANDOM UNBLOCKED COLUMN:", randomCol);
  return randomCol;
};

// Block a column with poop
export const blockColumn = (blockedColumns, columnIndex) => {
  console.log("💩 BLOCKING COLUMN:", columnIndex);
  
  // Remove any existing block for this column
  const filtered = blockedColumns.filter(b => b.columnIndex !== columnIndex);
  
  // Add new block
  filtered.push({
    columnIndex,
    turnsLeft: 2,
    createdAt: Date.now()
  });
  
  return filtered;
};

// Update blocked columns (decrease turns)
export const updateBlockedColumns = (blockedColumns) => {
  const updated = blockedColumns.map(block => ({
    ...block,
    turnsLeft: block.turnsLeft - 1
  })).filter(block => block.turnsLeft > 0);
  
  console.log("🕒 UPDATED BLOCKED COLUMNS:", updated);
  return updated;
};

// Check if column is blocked
export const isColumnBlocked = (blockedColumns, columnIndex) => {
  const blocked = blockedColumns.find(b => b.columnIndex === columnIndex && b.turnsLeft > 0);
  return !!blocked;
};

// Clear opponent discs from a random row (Rooster of Rage)
export const clearOpponentDiscsFromRandomRow = (board, triggeringPlayer) => {
  console.log("🔥 ROOSTER OF RAGE - CLEARING OPPONENT DISCS:", triggeringPlayer);
  
  const opponentPlayer = triggeringPlayer === "🔴" ? "🟡" : "🔴";
  
  // Find rows that contain opponent discs
  const rowsWithOpponent = [];
  for (let row = 0; row < ROWS; row++) {
    let hasOpponent = false;
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === opponentPlayer) {
        hasOpponent = true;
        break;
      }
    }
    if (hasOpponent) {
      rowsWithOpponent.push(row);
    }
  }
  
  if (rowsWithOpponent.length === 0) {
    console.log("❌ NO ROWS WITH OPPONENT DISCS TO CLEAR");
    return { newBoard: board, clearedRow: -1 };
  }
  
  const randomRow = rowsWithOpponent[Math.floor(Math.random() * rowsWithOpponent.length)];
  console.log("🎯 CLEARING ROW:", randomRow);
  
  const newBoard = board.map((row, r) => {
    if (r === randomRow) {
      return row.map(cell => cell === opponentPlayer ? EMPTY : cell);
    }
    return [...row];
  });
  
  console.log("🔥 ROOSTER CLEARED OPPONENT DISCS FROM ROW:", randomRow);
  return { newBoard, clearedRow: randomRow };
};

// Apply gravity after row clearing (compatible with upside-down mode)
export const applyGravityAfterRowClear = (board, isUpsideDown = false) => {
  console.log("🌊 APPLYING GRAVITY AFTER ROW CLEAR:", { isUpsideDown });
  
  const newBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
  
  for (let col = 0; col < COLS; col++) {
    // Collect all non-empty pieces in this column
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      const cell = board[row][col];
      if (cell !== EMPTY) {
        pieces.push(cell);
      }
    }
    
    // Apply gravity based on orientation
    if (isUpsideDown) {
      // In upside-down mode, pieces stack from top (row 0) downward
      for (let i = 0; i < pieces.length; i++) {
        newBoard[i][col] = pieces[i];
      }
    } else {
      // In normal mode, pieces stack from bottom (row ROWS-1) upward
      for (let i = 0; i < pieces.length; i++) {
        newBoard[ROWS - 1 - i][col] = pieces[pieces.length - 1 - i];
      }
    }
  }
  
  console.log("🌊 GRAVITY APPLIED AFTER ROW CLEAR");
  return newBoard;
};

// Get random chicken voice line
export const getRandomChickenVoiceLine = () => {
  return CHICKEN_VOICE_LINES[Math.floor(Math.random() * CHICKEN_VOICE_LINES.length)];
};

// Get random rooster voice line
export const getRandomRoosterVoiceLine = () => {
  return ROOSTER_VOICE_LINES[Math.floor(Math.random() * ROOSTER_VOICE_LINES.length)];
};

// Check if player should trigger Chaos Chicken
export const shouldTriggerChaosChicken = (board, lastRow, lastCol, player, chaosChickenState) => {
  console.log("🐔 CHECKING CHAOS CHICKEN TRIGGER:", {
    player,
    lastRow,
    lastCol,
    chaosChickenState
  });
  
  // Check if player has retired their chicken
  const playerKey = player === "🔴" ? "player1" : "player2";
  if (chaosChickenState.hasUsedRooster[playerKey]) {
    console.log("❌ PLAYER HAS RETIRED THEIR CHICKEN:", player);
    return false;
  }
  
  // Check if new 2x2 square was formed
  const { count } = detectNew2x2Squares(board, player, lastRow, lastCol);
  const hasNew2x2 = count > 0;
  
  console.log("🎯 CHAOS CHICKEN DECISION:", {
    player,
    hasNew2x2,
    playerActivations: chaosChickenState.chickenActivations[playerKey],
    hasUsedRooster: chaosChickenState.hasUsedRooster[playerKey]
  });
  
  return hasNew2x2;
};

// Get player activation count
export const getPlayerActivationCount = (chaosChickenState, player) => {
  const playerKey = player === "🔴" ? "player1" : "player2";
  return chaosChickenState.chickenActivations[playerKey];
};

// Check if this will be a Rooster of Rage activation
export const isRoosterOfRageActivation = (chaosChickenState, player) => {
  const playerKey = player === "🔴" ? "player1" : "player2";
  return chaosChickenState.chickenActivations[playerKey] === 1 && !chaosChickenState.hasUsedRooster[playerKey];
};

// Find nearest available column
export const findNearestAvailableColumn = (board, targetCol, blockedColumns, isUpsideDown = false) => {
  console.log("🔍 FINDING NEAREST AVAILABLE COLUMN:", { targetCol, isUpsideDown });
  
  // Check if target column is available
  if (!isColumnBlocked(blockedColumns, targetCol)) {
    // Check if column has space
    const hasSpace = isUpsideDown 
      ? board[0][targetCol] === EMPTY 
      : board[ROWS - 1][targetCol] === EMPTY;
    
    if (hasSpace) {
      console.log("✅ TARGET COLUMN IS AVAILABLE:", targetCol);
      return targetCol;
    }
  }
  
  // Search outward from target column
  for (let distance = 1; distance < COLS; distance++) {
    // Check left
    const leftCol = targetCol - distance;
    if (leftCol >= 0 && !isColumnBlocked(blockedColumns, leftCol)) {
      const hasSpace = isUpsideDown 
        ? board[0][leftCol] === EMPTY 
        : board[ROWS - 1][leftCol] === EMPTY;
      
      if (hasSpace) {
        console.log("✅ FOUND AVAILABLE COLUMN TO LEFT:", leftCol);
        return leftCol;
      }
    }
    
    // Check right
    const rightCol = targetCol + distance;
    if (rightCol < COLS && !isColumnBlocked(blockedColumns, rightCol)) {
      const hasSpace = isUpsideDown 
        ? board[0][rightCol] === EMPTY 
        : board[ROWS - 1][rightCol] === EMPTY;
      
      if (hasSpace) {
        console.log("✅ FOUND AVAILABLE COLUMN TO RIGHT:", rightCol);
        return rightCol;
      }
    }
  }
  
  console.log("❌ NO AVAILABLE COLUMNS FOUND");
  return -1;
};