import { ROWS, COLS, EMPTY } from "../helperFunction";
import { CHICKEN_CONFIG } from "../../logic/funMode";

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

// === CHAOS CHICKEN COLUMN BLOCKING PROBABILITY (70-30) ===
export const getRandomUnblockedColumn = (blockedColumns, board) => {
  const availableColumns = [];
  const nonEmptyColumns = [];
  const emptyColumns = [];

  for (let col = 0; col < COLS; col++) {
    const blocked = blockedColumns.find(b => b.columnIndex === col && b.turnsLeft > 0);
    if (!blocked) {
      availableColumns.push(col);
      
      // Check if column has at least one disc
      let hasDisc = false;
      if (board) {
        for (let row = 0; row < ROWS; row++) {
          if (board[row][col] !== EMPTY) {
            hasDisc = true;
            break;
          }
        }
      }
      
      if (hasDisc) {
        nonEmptyColumns.push(col);
      } else {
        emptyColumns.push(col);
      }
    }
  }
  
  if (availableColumns.length === 0) {
    console.log("❌ NO UNBLOCKED COLUMNS AVAILABLE");
    return null;
  }
  
  // 70% chance to block a non-empty column, 30% chance for empty
  const roll = Math.random();
  console.log(`🎲 Probability roll for column blocking: ${roll.toFixed(2)} (Target: < ${CHICKEN_CONFIG.POOP_NON_EMPTY_PROBABILITY.toFixed(2)} for Non-Empty)`);
  
  let targetColArray;
  if (roll < CHICKEN_CONFIG.POOP_NON_EMPTY_PROBABILITY && nonEmptyColumns.length > 0) {
    console.log("📈 Selected 70% probability: Choosing a non-empty column");
    targetColArray = nonEmptyColumns;
  } else if (emptyColumns.length > 0) {
    if (roll < 0.70) {
      console.log("📈 Rolled 70% but NO non-empty columns exist. Falling back to empty columns.");
    } else {
      console.log("📉 Selected 30% probability: Choosing an empty column");
    }
    targetColArray = emptyColumns;
  } else {
    console.log("⚠️ No empty columns either. Falling back to any available column.");
    targetColArray = availableColumns;
  }
  
  const randomCol = targetColArray[Math.floor(Math.random() * targetColArray.length)];
  console.log("🎯 FINAL SELECTED RANDOM UNBLOCKED COLUMN:", randomCol);
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
    turnsLeft: CHICKEN_CONFIG.POOP_BLOCK_DURATION,
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

// === ROOSTER OF RAGE ROW SELECTION ===
export const selectNonEmptyRowForRooster = (board) => {
  const nonEmptyRows = [];
  
  for (let row = 0; row < ROWS; row++) {
    let hasDisc = false;
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== EMPTY) {
        hasDisc = true;
        break;
      }
    }
    if (hasDisc) {
      nonEmptyRows.push(row);
    }
  }
  
  if (nonEmptyRows.length === 0) {
    console.log("❌ ROOSTER OF RAGE: No non-empty rows available (board is empty)");
    return -1;
  }
  
  const randomRow = nonEmptyRows[Math.floor(Math.random() * nonEmptyRows.length)];
  console.log("🎯 ROOSTER OF RAGE: Selected non-empty row:", randomRow);
  return randomRow;
};

// === ROOSTER OF RAGE DISC REMOVAL ===
export const clearOpponentDiscsInRow = (board, rowIndex, player) => {
  if (rowIndex === -1) return { newBoard: board, clearedCount: 0 };
  
  const opponentPlayer = player === "🔴" ? "🟡" : "🔴";
  const newBoard = board.map(r => [...r]);
  
  let clearedCount = 0;
  for (let col = 0; col < COLS; col++) {
    if (newBoard[rowIndex][col] === opponentPlayer) {
      newBoard[rowIndex][col] = EMPTY;
      clearedCount++;
    }
  }
  
  console.log(`🔥 ROOSTER OF RAGE: Cleared ${clearedCount} opponent discs from row ${rowIndex}`);
  return { newBoard, clearedCount };
};

// === GRAVITY AFTER ROW CLEAR (Normal + Upside Down) ===
export const applyGravityAfterClear = (board, isUpsideDown = false) => {
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
  return CHICKEN_CONFIG.CHICKEN_VOICE_LINES[Math.floor(Math.random() * CHICKEN_CONFIG.CHICKEN_VOICE_LINES.length)];
};

// Get random rooster voice line
export const getRandomRoosterVoiceLine = () => {
  return CHICKEN_CONFIG.ROOSTER_VOICE_LINES[Math.floor(Math.random() * CHICKEN_CONFIG.ROOSTER_VOICE_LINES.length)];
};

// Check if player should trigger Chaos Chicken
export const shouldTriggerChaosChicken = (board, lastRow, lastCol, player, chaosChickenState) => {
  // Check if player has reached their Rooster limit
  const playerKey = player === "🔴" ? "player1" : "player2";
  const roosterCount = chaosChickenState.roosterCount?.[playerKey] || 0;
  
  if (roosterCount >= CHICKEN_CONFIG.MAX_ROOSTER_PER_PLAYER) {
    console.log("❌ PLAYER HAS REACHED ROOSTER LIMIT:", player);
    return false;
  }
  
  // Check if new 2x2 square was formed
  const { count } = detectNew2x2Squares(board, player, lastRow, lastCol);
  const hasNew2x2 = count > 0;
  
  return hasNew2x2;
};

// Check if this will be a Rooster of Rage activation
export const isRoosterOfRageActivation = (chaosChickenState, player) => {
  const playerKey = player === "🔴" ? "player1" : "player2";
  const currentActivations = chaosChickenState.chickenActivations[playerKey];
  
  // Triggers if it's the (ROOSTER_THRESHOLD)-th activation
  return currentActivations === (CHICKEN_CONFIG.ROOSTER_THRESHOLD - 1);
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