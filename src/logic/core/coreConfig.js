/**
 * THE SINGLE SOURCE OF TRUTH
 * All game rules, players, and animation constants live here.
 */

export const CORE_CONFIG = {
  ROWS: 6,
  COLS: 7,
  WIN_LENGTH: 4,
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
export const WIN_LENGTH = CORE_CONFIG.WIN_LENGTH;

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

// Gameplay Patterns (The Names)
export const PATTERNS = {
  LINE: "LINE",
  SQUARE: "SQUARE",
  CROSS: "CROSS",
};
