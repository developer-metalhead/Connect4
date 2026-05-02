export const ROWS = 6;
export const COLS = 7;
export const PLAYER1 = "🔴";
export const PLAYER2 = "🟡";
export const EMPTY = "⚪";

export const ANIMATION_CONFIG = {
  // Core Piece Drop Animations
  DROP_BASE_DURATION: 400,
  DROP_PER_ROW_ADDITION: 50,
  GRAVITY_DROP_PER_ROW: 120,
  
  // Board Effects
  SHAKE_DELAY: 60,
  SHAKE_DURATION: 150,
  RIPPLE_DURATION: 500,

  // CPU Specific Timings
  CPU_THINKING_DURATION: 350,   // Delay before CPU starts "targeting"
  CPU_TARGETING_DURATION: 450,  // Delay while CPU shows highlight/preview before dropping
  CPU_POST_DROP_DELAY: 150,     // Delay after drop finishes before next turn starts
};

export const PATTERNS = {
  IN_A_ROW: "IN_A_ROW",
  SQUARE: "SQUARE",
};
