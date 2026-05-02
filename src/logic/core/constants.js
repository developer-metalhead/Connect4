import { CORE_CONFIG, PLAYERS, ANIMATION_CONFIG as CORE_ANIM } from "../coreConfig";

export const ROWS = CORE_CONFIG.ROWS;
export const COLS = CORE_CONFIG.COLS;
export const PLAYER1 = PLAYERS.P1;
export const PLAYER2 = PLAYERS.P2;
export const EMPTY = PLAYERS.EMPTY;

export const ANIMATION_CONFIG = {
  ...CORE_ANIM,
  // Add any legacy-specific overrides if needed
  CPU_THINKING_DURATION: 350,
  CPU_TARGETING_DURATION: 450,
  CPU_POST_DROP_DELAY: 150,
};

export const PATTERNS = {
  IN_A_ROW: "IN_A_ROW",
  SQUARE: "SQUARE",
};
