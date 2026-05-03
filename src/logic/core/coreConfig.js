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

export const EVENTS = {
  // Game Flow
  GAME_START: "GAME_START",
  GAME_RESET: "GAME_RESET",
  GAME_WIN: "GAME_WIN",
  GAME_DRAW: "GAME_DRAW",
  
  // Player Actions
  PIECE_DROPPED: "PIECE_DROPPED",
  TURN_CHANGED: "TURN_CHANGED",
  
  // Special Features
  FEATURE_TRIGGERED: "FEATURE_TRIGGERED",
  FEATURE_ANIMATION_START: "FEATURE_ANIMATION_START",
  FEATURE_ANIMATION_END: "FEATURE_ANIMATION_END",
  COLUMN_BLOCKED: "COLUMN_BLOCKED",
  GRAVITY_FLIPPED: "GRAVITY_FLIPPED",
  
  // CPU & AI
  CPU_THINKING_START: "CPU_THINKING_START",
  CPU_THINKING_END: "CPU_THINKING_END",
  CPU_MOVE_DECIDED: "CPU_MOVE_DECIDED",
  
  // UI & System
  UI_LOCK: "UI_LOCK",
  UI_UNLOCK: "UI_UNLOCK",
  SOUND_TRIGGER: "SOUND_TRIGGER",
  UI_SHAKE: "UI_SHAKE"
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

// --- THE MASTER RULESET REGISTRY ---
export const RULESETS = {
  CLASSIC: {
    NAME: "Classic",
    ROWS: 6,
    COLS: 7,
    WIN_PATTERN: { type: PATTERNS.LINE, length: 4 }
  },
  GRAND: {
    NAME: "Grand Connect",
    ROWS: 8,
    COLS: 10,
    WIN_PATTERN: { type: PATTERNS.LINE, length: 5 }
  },
  BLITZ: {
    NAME: "Blitz Mode",
    ROWS: 4,
    COLS: 5,
    WIN_PATTERN: { type: PATTERNS.LINE, length: 3 }
  },
  CHAOS_SQUARE: {
    NAME: "Chaos Square",
    ROWS: 6,
    COLS: 7,
    WIN_PATTERN: { type: PATTERNS.SQUARE, size: 2 }
  },
  TIC_TAC_TOE: {
    NAME: "Tic Tac Toe",
    ROWS: 3,
    COLS: 3,
    WIN_PATTERN: { type: PATTERNS.LINE, size: 3 }
  }
};

// THE MASTER MODE SWITCH (The absolute source of truth)
export const GAME_MODE_KEY = "CLASSIC"; 

// Derived Exports
export const ACTIVE_MODE = RULESETS[GAME_MODE_KEY];


// --- THE PHYSICS & ANIMATION ENGINE CONFIG ---
export const PHYSICS_CONFIG = {
  EJECTION: {
    VX_RANGE: 1200,
    VY_BASE: 400,
    VY_RANGE: 600,
    VR_RANGE: 1080,
  },
  ANIMATION: {
    DROP_BASE_DURATION: 400,
    DROP_PER_ROW_ADDITION: 50,
    GRAVITY_DROP_PER_ROW: 120,
    SHAKE_DELAY: 60,
    SHAKE_DURATION: 150,
    RIPPLE_DURATION: 500,
  },
  CPU:{
    CPU_THINKING_DURATION: 350,
    CPU_TARGETING_DURATION: 450,
    CPU_POST_DROP_DELAY: 150,
  }
};
export const ANIMATION_CONFIG = PHYSICS_CONFIG.ANIMATION;


// --- THE UI DICTIONARY ---
export const UI_STRINGS = {
  MENU: {
    GAME: "Game Settings",
    SOUND: "Sound Settings",
    BOARD: "Board Settings",
    CPU: "CPU Settings",
    ONLINE: "Online Settings",
    FUN: "Fun Mode Settings",
  },
  MATCH: {
    PLAY_AGAIN: "Play Again",
    MAIN_MENU: "Main Menu",
    WIN_TITLE: "VICTORY!",
    LOSS_TITLE: "DEFEAT",
    DRAW_TITLE: "DRAW",
    ROOM_CLOSED: "ROOM CLOSED",
    OPPONENT_LEFT: "Opponent Left",
    WAITING: "Waiting",
  }
};

// --- CORE ENGINE EXPORT ---
export const CORE_CONFIG = {
  MODE: ACTIVE_MODE, // This handles ROWS, COLS, and WIN_PATTERN
  DEFAULT_FIRST_PLAYER: EMOJIS.RED_DISC,
};

export const PLAYERS = {
  P1: EMOJIS.RED_DISC,
  P2: EMOJIS.YELLOW_DISC,
  EMPTY: EMOJIS.EMPTY_SLOT
};

// --- LEGACY COMPATIBILITY (Used by chaosChickenFeatures and other helpers) ---
export const ROWS = ACTIVE_MODE.ROWS;
export const COLS = ACTIVE_MODE.COLS;
export const EMPTY = EMOJIS.EMPTY_SLOT;
export const PLAYER1 = EMOJIS.RED_DISC;
export const PLAYER2 = EMOJIS.YELLOW_DISC;
