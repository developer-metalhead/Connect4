/**
 * Core Game Constants & Rules
 * This is the single source of truth for all game-related constants.
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

export const ANIMATION_CONFIG = {
  DROP_BASE_DURATION: 300,
  DROP_PER_ROW_ADDITION: 50,
  SHAKE_DURATION: 150,
  SHAKE_DELAY: 60,
  RIPPLE_DURATION: 500,
};
