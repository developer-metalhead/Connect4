/**
 * FUN MODE CONFIGURATION (PHASE 3: UNIVERSAL ULTIMATES)
 * 
 * --- CHARACTER CORE ---
 * NAME: Unique ID for the character.
 * ACTOR: Emoji that runs across the screen.
 * PROJECTILE: Emoji dropped/thrown on the board.
 * PATTERN: Geometry that triggers the character (Line, Square, Cross).
 * 
 * --- ACTION PARAMETERS (The "Sacred Names") ---
 * MAYHEM_DURATION: Turns the gravity stays flipped.
 * STEAL_PROBABILITY: Chance (0-1) to remove a random disc.
 * POOP_BLOCK_DURATION: Turns a column stays blocked.
 * POOP_NON_EMPTY_PROBABILITY: Chance to target an occupied column.
 * EXPLOSION_RADIUS: Number of cells cleared around the center.
 * ROOSTER_STRIKE_PROBABILITY: Success rate of the Ultimate Ability.
 * 
 * --- EVOLUTION KEYS ---
 * TRIGGER_THRESHOLD: Matches needed to trigger BASE actions.
 * ULTIMATE_THRESHOLD: Matches needed to escalate to ULTIMATE actions.
 */
import { PATTERNS, FEATURES, EMOJIS } from "../core/coreConfig";
import { ACTIONS } from "./actionEngine";

export const MONKEY_CONFIG = {
  NAME: FEATURES.MONKEY,
  ACTOR: EMOJIS.MONKEY,
  PROJECTILE: EMOJIS.BANANA,
  PATTERN: { type: PATTERNS.LINE, length: 3 },
  
  // BASE ACTIONS (Triggers normally)
  ACTIONS: [
    { 
      type: ACTIONS.GRAVITY_FLIP, 
      MAYHEM_DURATION: 4 
    },
    { 
      type: ACTIONS.REMOVE_DISC, 
      STEAL_PROBABILITY: 0.75 
    },
       // { 
    //   type: ACTIONS.BLOCK_COLUMN, 
    //   POOP_NON_EMPTY_PROBABILITY: 0.70, 
    //   POOP_BLOCK_DURATION: 3 
    // }
  ],
  
  TRIGGER_THRESHOLD: 2,
  MAX_ACTIVATIONS_PER_MATCH: 1,
  
  
  VOICE_LINES: [
    "Time to flip things up!",
    "Ooo-ooo! Gravity is my playground!",
    "Board go brrr!",
    "Monkey business time!",
    "Let's turn this upside down!",
  ]
};

export const CHICKEN_CONFIG = {
  NAME: FEATURES.CHICKEN,
  ACTOR: EMOJIS.CHICKEN,
  PROJECTILE: EMOJIS.POOP,
  PATTERN: { type: PATTERNS.SQUARE, size: 2 },
  
  // BASE ACTIONS (Chaos Chicken - Pooping)
  ACTIONS: [
    { 
      type: ACTIONS.BLOCK_COLUMN, 
      POOP_NON_EMPTY_PROBABILITY: 0.70, 
      POOP_BLOCK_DURATION: 3 
    }
  ],

  // ULTIMATE ACTIONS (Rooster of Rage - Stealing/Clearing)
  ULTIMATE_ACTIONS: [
    { 
      type: ACTIONS.REMOVE_DISC, 
      ROOSTER_STRIKE_PROBABILITY: 1.0 
    }
  ],
  
  TRIGGER_THRESHOLD: 1,
  ULTIMATE_THRESHOLD: 2, 
 
  MAX_ROOSTER_PER_PLAYER: 1,
  RESET_AFTER_ROOSTER: false,
  
  CHICKEN_VOICE_LINES: [
    "Bawk bawk! Chaos time!",
    "Cluck cluck! Here comes trouble!",
    "Chicken alert! Incoming poop!",
    "Feathers flying everywhere!",
    "Time to ruffle some feathers!",
  ],
  
  ROOSTER_VOICE_LINES: [
    "RAAAWR! Rooster of Rage!",
    "COCK-A-DOODLE-DOOM!",
    "Fire and fury unleashed!",
    "Behold the mighty rooster!",
    "Rage mode activated!",
  ]
};

export const BOMB_CONFIG = {
  NAME: FEATURES.BOMB,
  ACTOR: EMOJIS.BOMB,
  PROJECTILE: EMOJIS.EXPLOSION,
  PATTERN: { type: PATTERNS.CROSS, armLength: 1 },
  ACTIONS: [
    { type: ACTIONS.EXPLODE, EXPLOSION_RADIUS: 2 }
  ],
  TRIGGER_THRESHOLD: 1,
};

export const FUN_MODE_CONFIG = {
  [FEATURES.MONKEY]: MONKEY_CONFIG,
  [FEATURES.CHICKEN]: CHICKEN_CONFIG,
  [FEATURES.BOMB]: BOMB_CONFIG,
};
