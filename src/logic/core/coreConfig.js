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
  // Pattern identifiers
  LINE: "LINE",
  SQUARE: "SQUARE",
  CROSS: "CROSS",
  BLOCKED: "BLOCKED"
};

// THE CHARACTER DICTIONARY (Universal Feature Keys)
export const FEATURES = {
  MONKEY: "MONKEY",
  CHICKEN: "CHICKEN",
  BOMB: "BOMB"
};

// THE EMOJI DICTIONARY (Visual Source of Truth)
export const EMOJIS = {
  // Characters
  MONKEY: "🐒",
  CHICKEN: "🐔",
  ROOSTER: "🐓",
  BOMB: "💣",
  
  // Projectiles & Effects
  BANANA: "🍌",
  POOP: "💩",
  FIRE: "🔥",
  EXPLOSION: "💥",
  ULTIMATE_GLOW: "🌟",
  
  // UI & Menu Icons
  UI_GAME: "🎮",
  UI_SOUND: "🔊",
  UI_BOARD: "⚙️",
  UI_CPU: "🤖",
  UI_ONLINE: "🌐",
  UI_FUN: "🔥",

  // Game End Status
  WIN_CROWN: "🏆",
  LOSS_SAD: "😔",
  DRAW_HANDSHAKE: "🤝",

  // Board Pieces
  RED_DISC: "🔴",
  YELLOW_DISC: "🟡",
  EMPTY_SLOT: "⚪"
};

// THE SOUND DICTIONARY (Universal Audio)
export const SOUNDS = {
  // UI & General
  CLICK: "click",
  COINS: "coinsfalling",
  SURRENDER: "surrender",
  WIN: "win",
  LOSE: "lose",
  DRAW: "draw",
  
  // Character Specific
  MONKEY_LAUGH: "monkeylaugh",
  CHICKEN_CLUCK: "chickenbawk",
  ROOSTER_RAGE: "rooster",
  BOMB_EXPLOSION: "bomb_explosion",
};

// --- LEGACY COMPATIBILITY LAYER ---
// These are used by legacy helpers and engines.
export const ROWS = 6;
export const COLS = 7;
export const PLAYER1 = EMOJIS.RED_DISC;
export const PLAYER2 = EMOJIS.YELLOW_DISC;
export const EMPTY = EMOJIS.EMPTY_SLOT;


export const CORE_CONFIG = {
  ROWS: ROWS,
  COLS: COLS,
  // PLUG & PLAY: Change this to ANY pattern to change the goal of the game!
  WIN_PATTERN: { type: PATTERNS.LINE, length: 4 }, 
  DEFAULT_FIRST_PLAYER: EMOJIS.RED_DISC,
};

export const PLAYERS = {
  P1: EMOJIS.RED_DISC,
  P2: EMOJIS.YELLOW_DISC,
  EMPTY: EMOJIS.EMPTY_SLOT
};

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
