import { EMPTY, PATTERNS } from "../core/coreConfig";

/**
 * TRULY DYNAMIC PATTERN ENGINE
 * Standardized to return { row, col } for UI compatibility.
 */

// === 1. SHAPE FACTORY ===
export const SHAPE_FACTORY = {
  [PATTERNS.SQUARE]: ({ size = 2 }) => {
    const offsets = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) offsets.push({ dr: r, dc: c });
    }
    return [offsets];
  },

  [PATTERNS.LINE]: ({ length = 4 }) => {
    const horizontal = [], vertical = [], diag1 = [], diag2 = [];
    for (let i = 0; i < length; i++) {
      horizontal.push({ dr: 0, dc: i });
      vertical.push({ dr: i, dc: 0 });
      diag1.push({ dr: i, dc: i });
      diag2.push({ dr: -i, dc: i });
    }
    return [horizontal, vertical, diag1, diag2];
  },

  [PATTERNS.CROSS]: ({ armLength = 1 }) => {
    const offsets = [{ dr: 0, dc: 0 }];
    for (let i = 1; i <= armLength; i++) {
      offsets.push({ dr: i, dc: 0 }, { dr: -i, dc: 0 }, { dr: 0, dc: i }, { dr: 0, dc: -i });
    }
    return [offsets];
  }
};

const resolvePattern = (patternObj) => {
  if (!patternObj || !patternObj.type) return null;
  const generator = SHAPE_FACTORY[patternObj.type];
  if (!generator) return null;

  return {
    shapes: generator(patternObj),
    sliding: true // All patterns can be completed from any position
  };
};

// === 2. SCANNING ENGINE ===
const isShapeAt = (board, r, c, shape, player) => {
  const rows = board.length, cols = board[0].length;
  for (const offset of shape) {
    const nr = r + offset.dr, nc = c + offset.dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== player) return false;
  }
  return true;
};

export const findPatternAt = (board, targetR, targetC, player, patternObj) => {
  const def = resolvePattern(patternObj);
  if (!def) return [];

  const found = [];
  for (const shape of def.shapes) {
    const rootsToCheck = def.sliding ? shape : [shape[0]];
    for (const rootOff of rootsToCheck) {
      const rootR = targetR - rootOff.dr, rootC = targetC - rootOff.dc;
      if (isShapeAt(board, rootR, rootC, shape, player)) {
        // UI expects { row, col }
        const instance = shape.map(o => ({ row: rootR + o.dr, col: rootC + o.dc }));
        const key = instance.map(p => `${p.row},${p.col}`).sort().join("|");
        if (!found.find(f => f.key === key)) found.push({ key, coords: instance });
      }
    }
  }
  return found;
};

export const findAllPatterns = (board, player, patternObj) => {
  const def = resolvePattern(patternObj);
  if (!def) return [];

  const found = [], rows = board.length, cols = board[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== player) continue;
      for (const shape of def.shapes) {
        if (isShapeAt(board, r, c, shape, player)) {
          // UI expects { row, col }
          const instance = shape.map(o => ({ row: r + o.dr, col: c + o.dc }));
          const key = instance.map(p => `${p.row},${p.col}`).sort().join("|");
          if (!found.find(f => f.key === key)) found.push({ key, coords: instance });
        }
      }
    }
  }
  return found;
};
