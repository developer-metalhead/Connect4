/**
 * THE SINGLE SOURCE OF TRUTH
 * All game rules, players, and animation constants live here.
 */

/*
* 1. { type: PATTERNS.LINE, length: N }     -> N pieces in a straight line (H, V, or D)
* 2. { type: PATTERNS.SQUARE, size: N }     -> An N x N solid square (e.g. 2x2, 3x3)
* 3. { type: PATTERNS.CROSS, armLength: N } -> A center piece with arms of length N
*/

// Gameplay Patterns (The Names)
export const PATTERNS = {
  LINE: "LINE",
  SQUARE: "SQUARE",
  CROSS: "CROSS",
};
export const CORE_CONFIG = {
  ROWS: 6,
  COLS: 7,
  // PLUG & PLAY: Change this to ANY pattern to change the goal of the game!
  WIN_PATTERN: { type: PATTERNS.LINE, length: 4 }, 
  DEFAULT_FIRST_PLAYER: "🔴",
};

export const PLAYERS = {
  P1: "🔴",
  P2: "🟡",
  EMPTY: "⚪"
};

// Flat exports for easier destructuring across the app
export const ROWS = CORE_CONFIG.ROWS;
export const COLS = CORE_CONFIG.COLS;
export const PLAYER1 = PLAYERS.P1;
export const PLAYER2 = PLAYERS.P2;
export const EMPTY = PLAYERS.EMPTY;
// We extract a 'Representative Length' for legacy UI components
export const WIN_LENGTH = 
  CORE_CONFIG.WIN_PATTERN.length || 
  CORE_CONFIG.WIN_PATTERN.size || 
  (CORE_CONFIG.WIN_PATTERN.armLength ? (CORE_CONFIG.WIN_PATTERN.armLength * 2 + 1) : 4);

// Unified Animation & Timing
export const ANIMATION_CONFIG = {
  // Visual Effects
  DROP_BASE_DURATION: 400,
  DROP_PER_ROW_ADDITION: 50,
  GRAVITY_DROP_PER_ROW: 120,
  SHAKE_DELAY: 60,
  SHAKE_DURATION: 150,
  RIPPLE_DURATION: 500,

  // CPU Brain Timings
  CPU_THINKING_DURATION: 350,
  CPU_TARGETING_DURATION: 450,
  CPU_POST_DROP_DELAY: 150,
};


