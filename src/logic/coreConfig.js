/**
 * CORE GAME CONFIGURATION
 * 
 * Central rules for the Connect 4 engine.
 */

export const CORE_CONFIG = {
  // --- BOARD DIMENSIONS ---
  ROWS: 6,
  COLS: 7,

  // --- WIN CONDITIONS ---
  WIN_LENGTH: 4,          // Connect 4! (Change to 5 for a challenge)
  
  // --- PLAYER IDENTIFIERS ---
  PLAYERS: {
    P1: "🔴",
    P2: "🟡",
    EMPTY: "⚪"
  },

  // --- GAMEPLAY SETTINGS ---
  DEFAULT_FIRST_PLAYER: "🔴",
  ALLOW_DRAW: true,
};
