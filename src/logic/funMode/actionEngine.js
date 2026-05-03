/**
 * THE ACTION ENGINE (PHASE 3: SMART SEMANTICS)
 */

import { EMOJIS } from "../core/coreConfig";

export const ACTIONS = {
  GRAVITY_FLIP: "GRAVITY_FLIP",
  REMOVE_DISC: "REMOVE_DISC",
  BLOCK_COLUMN: "BLOCK_COLUMN",
  EXPLODE: "EXPLODE",
};

const resolve = (obj, keys, fallback) => {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return fallback;
};

export const executeGravityFlip = (current) => {
  return current === "normal" ? "inverted" : "normal";
};

export const executeRemoveDisc = (board, options = {}) => {
  const prob = resolve(options, ["probability", "STEAL_PROBABILITY", "ROOSTER_STRIKE_PROBABILITY"], 1.0);
  if (Math.random() > prob) return { newBoard: board, removed: null };

  const occupiedCells = [];
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell !== EMOJIS.EMPTY_SLOT) occupiedCells.push({ r, c });
    });
  });

  if (occupiedCells.length === 0) return { newBoard: board, removed: null };

  const target = occupiedCells[Math.floor(Math.random() * occupiedCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[target.r][target.c] = EMOJIS.EMPTY_SLOT;

  return { newBoard, removed: target };
};

/**
 * ACTION: Block Column
 * Now stores the projectile emoji to make the UI indicator dynamic.
 */
export const executeBlockColumn = (board, currentBlocks, options = {}) => {
  const prob = resolve(options, ["probability", "POOP_NON_EMPTY_PROBABILITY"], 0.5);
  const duration = resolve(options, ["duration", "POOP_BLOCK_DURATION"], 3);
  const projectile = options.projectile || EMOJIS.POOP; 
  
  const nonEmptyCols = [];
  const emptyCols = [];
  
  for (let c = 0; c < board[0].length; c++) {
    const hasDiscs = board.some(row => row[c] !== EMOJIS.EMPTY_SLOT);
    if (hasDiscs) nonEmptyCols.push(c);
    else emptyCols.push(c);
  }

  let targetCol;
  if (Math.random() < prob && nonEmptyCols.length > 0) {
    targetCol = nonEmptyCols[Math.floor(Math.random() * nonEmptyCols.length)];
  } else if (emptyCols.length > 0) {
    targetCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
  } else {
    targetCol = Math.floor(Math.random() * board[0].length);
  }

  const newBlocked = [...(currentBlocks || [])];
  // NEW: Store the projectile in the blockedColumns state!
  newBlocked.push({ 
    columnIndex: targetCol, 
    turnsLeft: duration, 
    projectile: projectile 
  });

  return { targetCol, blockedColumns: newBlocked };
};

export const executeExplosion = (board, centerRow, centerCol, options = {}) => {
  const radius = resolve(options, ["radius", "EXPLOSION_RADIUS"], 1);
  const newBoard = board.map(row => [...row]);
  const removed = [];

  for (let r = centerRow - radius; r <= centerRow + radius; r++) {
    for (let c = centerCol - radius; c <= centerCol + radius; c++) {
      if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
        if (newBoard[r][c] !== EMOJIS.EMPTY_SLOT) {
          removed.push({ r, c, player: newBoard[r][c] });
          newBoard[r][c] = EMOJIS.EMPTY_SLOT;
        }
      }
    }
  }

  return { newBoard, removed };
};
