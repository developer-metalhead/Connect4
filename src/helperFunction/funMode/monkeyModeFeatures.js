import { ROWS, COLS, EMPTY } from "../../logic/core/coreConfig";
import { MONKEY_CONFIG } from "../../logic/funMode/funMode";
import { detectPattern } from "./patternDispatcher";
import { countSeparateInARows } from "./patternDetectors";

export const shouldTriggerMonkeyMayhem = (board, player, monkeyState) => {
  // Check if we reached the match limit
  if (monkeyState.totalActivations >= MONKEY_CONFIG.MAX_ACTIVATIONS_PER_MATCH) {
    console.log("❌ MONKEY MAYHEM MATCH LIMIT REACHED:", MONKEY_CONFIG.MAX_ACTIVATIONS_PER_MATCH);
    return false;
  }

  // PLUG & PLAY: Use the dispatcher to find matches based on REQUIRED_PATTERN
  const { count: patternCount } = detectPattern(board, player, MONKEY_CONFIG);
  const shouldTrigger = patternCount >= MONKEY_CONFIG.TRIGGER_THRESHOLD;
  
  console.log(`📊 MONKEY MAYHEM DECISION: ${shouldTrigger} (Found ${patternCount}/${MONKEY_CONFIG.TRIGGER_THRESHOLD})`);

  return shouldTrigger;
};

export const flipBoardUpsideDown = (board) => {
  console.log("🔄 FLIPPING BOARD UPSIDE DOWN");
  console.log(
    "📋 BEFORE FLIP:",
    board.map((row) => row.join("")),
  );

  const newBoard = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(EMPTY));

  for (let col = 0; col < COLS; col++) {
    const pieces = [];

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] !== EMPTY) {
        pieces.push(board[row][col]);
      }
    }

    console.log(`📍 COLUMN ${col} PIECES:`, pieces);

    // Drop pieces from new top (flipped gravity) - pieces stack from top down
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

// === MONKEY STEAL DISC LOGIC ===
// Probability check and disc stealing function starts here
export const maybeStealDisc = (board, triggeringPlayer, isUpsideDown = false) => {
// Probability of monkey stealing a disc
  if (Math.random() > MONKEY_CONFIG.STEAL_PROBABILITY) {   
    console.log(`🍌 NO DISC STOLEN (${((1 - MONKEY_CONFIG.STEAL_PROBABILITY) * 100).toFixed(0)}% chance)`);
    return { newBoard: board, stolenCell: null };
  }

  console.log(`🍌 MONKEY STEALING A DISC! (${(MONKEY_CONFIG.STEAL_PROBABILITY * 100).toFixed(0)}% chance)`);

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
    return { newBoard: board, stolenCell: null };
  }

  const randomCell =
    opponentCells[Math.floor(Math.random() * opponentCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[randomCell.row][randomCell.col] = EMPTY;

  console.log("🍌 STOLE DISC FROM OPPONENT:", { 
    cell: randomCell, 
    opponent: opponentPlayer,
    triggeredBy: triggeringPlayer,
    isUpsideDown 
  });

  // Apply gravity based on board orientation
  const pieces = [];
  
  for (let row = 0; row < ROWS; row++) {
    if (newBoard[row][randomCell.col] !== EMPTY) {
      pieces.push(newBoard[row][randomCell.col]);
      newBoard[row][randomCell.col] = EMPTY;
    }
  }

  // Re-drop pieces according to current gravity orientation
  if (isUpsideDown) {
    // In upside-down mode, pieces stack from top (row 0) downward
    for (let i = 0; i < pieces.length; i++) {
      newBoard[i][randomCell.col] = pieces[i];
    }
    console.log("🙃 APPLIED UPSIDE-DOWN GRAVITY TO COLUMN", randomCell.col);
  } else {
    // In normal mode, pieces stack from bottom (row ROWS-1) upward
    for (let i = 0; i < pieces.length; i++) {
      newBoard[ROWS - 1 - i][randomCell.col] = pieces[i];
    }
    console.log("⬇️ APPLIED NORMAL GRAVITY TO COLUMN", randomCell.col);
  }

  console.log(
    "📋 AFTER DISC THEFT:",
    newBoard.map((row) => row.join("")),
  );
  return { newBoard, stolenCell: randomCell, opponentPlayer };
};

export const getRandomMonkeyVoiceLine = () => {
  return MONKEY_CONFIG.VOICE_LINES[
    Math.floor(Math.random() * MONKEY_CONFIG.VOICE_LINES.length)
  ];
};

export const isMonkeyWinner = (winner, isUpsideDown) => {
  return winner && isUpsideDown;
};

export const dropPieceUpsideDown = (board, col, player) => {
  console.log("🙃 DROPPING PIECE UPSIDE DOWN:", { col, player });
  console.log("🙃 COLUMN STATE BEFORE DROP:", board.map(row => row[col]));

  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      console.log("✅ UPSIDE DOWN DROP SUCCESS:", { row, col, player });
      console.log("🙃 COLUMN STATE AFTER DROP:", newBoard.map(r => r[col]));
      return { newBoard, row };
    }
  }

  console.log("❌ UPSIDE DOWN COLUMN FULL:", col);
  return { newBoard: board, row: -1 };
};

export const isValidMoveUpsideDown = (board, col) => {
  if (col < 0 || col >= COLS) return false;
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      return true;
    }
  }
  return false;
};

export const isBoardFullUpsideDown = (board) => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === EMPTY) {
        return false;
      }
    }
  }
  return true;
};

export const applyNormalGravity = (board) => {
  const newBoard = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(EMPTY));

  for (let col = 0; col < COLS; col++) {
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      const v = board[row][col];
      if (v !== EMPTY) pieces.push(v);
    }
    for (let j = 0; j < pieces.length; j++) {
      newBoard[ROWS - 1 - j][col] = pieces[pieces.length - 1 - j];
    }
  }
  return newBoard;
};

export const applyInvertedGravity = (board) => {
  const newBoard = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(EMPTY));

  for (let col = 0; col < COLS; col++) {
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      const v = board[row][col];
      if (v !== EMPTY) pieces.push(v);
    }
    for (let j = 0; j < pieces.length; j++) {
      newBoard[j][col] = pieces[j];
    }
  }
  return newBoard;
};

export const planNormalGravityAnimation = (board) => {
  const animations = [];
  for (let col = 0; col < COLS; col++) {
    const positions = [];
    const values = [];
    for (let row = 0; row < ROWS; row++) {
      const v = board[row][col];
      if (v !== EMPTY) {
        positions.push(row);
        values.push(v);
      }
    }
    const n = values.length;
    for (let k = 0; k < n; k++) {
      animations.push({
        col,
        fromRow: positions[k],
        toRow: ROWS - n + k,
        player: values[k],
      });
    }
  }
  return animations;
};

export const planInvertedGravityAnimation = (board) => {
  const animations = [];
  for (let col = 0; col < COLS; col++) {
    const positions = [];
    const values = [];
    for (let row = 0; row < ROWS; row++) {
      const v = board[row][col];
      if (v !== EMPTY) {
        positions.push(row);
        values.push(v);
      }
    }
    const n = values.length;
    for (let k = 0; k < n; k++) {
      animations.push({
        col,
        fromRow: positions[k],
        toRow: k,
        player: values[k],
      });
    }
  }
  return animations;
};

// === NEW: Unified helper for returning to normal gravity ===
// Detects flipped via flag and returns { finalBoard, animations, durationMs }.
// If not flipped, returns passthrough (no-op).
export const returnToNormalGravity = (board, { isUpsideDown, isVisualRotation } = {}) => {
  if (!isUpsideDown) {
    return { finalBoard: board, animations: [], durationMs: 0 };
  }
  
  const animations = isVisualRotation 
    ? planInvertedGravityAnimation(board) 
    : planNormalGravityAnimation(board);
    
  const finalBoard = isVisualRotation 
    ? applyInvertedGravity(board) 
    : applyNormalGravity(board);

  const unitDuration = 70; // ms per row
  const base = 300; // ms base for UX
  let maxDist = 0;
  for (const a of animations) {
    maxDist = Math.max(maxDist, Math.abs(a.toRow - a.fromRow));
  }
  const durationMs = base + maxDist * unitDuration;
  
  return { finalBoard, animations, durationMs };
};

// CHANGE: Extracted player name generation to utility function
export const getPlayerNames = (monkeyMayhemState) => {
  const names = { "🔴": "Player 1", "🟡": "Player 2" };

  if (monkeyMayhemState.usedBy === "🔴") {
    names["🔴"] += " 🐒";
  }
  if (monkeyMayhemState.usedBy === "🟡") {
    names["🟡"] += " 🐒";
  }

  return names;
};

// CHANGE: Extracted monkey button click handler to utility function
export const createMonkeyButtonHandler = (soundManager, triggerMonkeyMayhem) => {
  return () => {
    console.log("🐒 MONKEY BUTTON CLICKED!");
    soundManager.playClickSound();
    triggerMonkeyMayhem();
  };
};

// CHANGE: Extracted board interaction calculation to utility function
export const canInteractWithBoard = (isMonkeyAnimating, showMonkeyButton, isGravityFalling) => {
  return !isMonkeyAnimating && !showMonkeyButton && !isGravityFalling;
};