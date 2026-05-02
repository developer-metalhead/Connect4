/**
 * FUN MODE CONFIGURATION
 * 
 * --- PATTERN DICTIONARY ---
 * Use these coupled objects to define triggers.
 * 
 * 1. { type: PATTERNS.LINE, length: N }     -> N pieces in a straight line (H, V, or D)
 * 2. { type: PATTERNS.SQUARE, size: N }     -> An N x N solid square (e.g. 2x2, 3x3)
 * 3. { type: PATTERNS.CROSS, armLength: N } -> A center piece with arms of length N
 */
import { PATTERNS } from "../core/coreConfig";

export const MONKEY_CONFIG = {
  PATTERN: { type: PATTERNS.LINE, length: 3 },// Number of completed pattern matches required to enable the Monkey Mayhem button
  TRIGGER_THRESHOLD: 2,
  
  // Chance that the monkey will steal a disc after it appears (0.0 to 1.0)
  STEAL_PROBABILITY: 0.75,

  // How many turns the board stays upside down after mayhem is activated
  MAYHEM_DURATION: 4,

  // Global match limit: total times Monkey Mayhem can trigger in a single game
  MAX_ACTIVATIONS_PER_MATCH: 1,
  
  // The monkey's personality lines
  VOICE_LINES: [
    "Time to flip things up!",
    "Ooo-ooo! Gravity is my playground!",
    "Board go brrr!",
    "Monkey business time!",
    "Let's turn this upside down!",
  ]
};

export const CHICKEN_CONFIG = {
  PATTERN: { type: PATTERNS.SQUARE, size: 2 },
 // Matches required to trigger a standard Chaos Chicken event
 TRIGGER_THRESHOLD: 1,
  
 // Matches required to escalate to a Rooster of Rage event (replaces chicken)
 ROOSTER_THRESHOLD: 2,

 // Max times a single player can unleash the Rooster per match
 MAX_ROOSTER_PER_PLAYER: 1,

 // Whether to reset the pattern counter after a Rooster strike
 RESET_AFTER_ROOSTER: false,
 
 // Probability split: Chance to target a column that already has discs
 POOP_NON_EMPTY_PROBABILITY: 0.70,
 
 // Duration of the column block effect
 POOP_BLOCK_DURATION: 3,
 
 // Standard chicken commentary
 CHICKEN_VOICE_LINES: [
   "Bawk bawk! Chaos time!",
   "Cluck cluck! Here comes trouble!",
   "Chicken alert! Incoming poop!",
   "Feathers flying everywhere!",
   "Time to ruffle some feathers!",
 ],
 
 // High-stakes rooster commentary
 ROOSTER_VOICE_LINES: [
   "RAAAWR! Rooster of Rage!",
   "COCK-A-DOODLE-DOOM!",
   "Fire and fury unleashed!",
   "Behold the mighty rooster!",
   "Rage mode activated!",
 ]
};

export const BOMB_CONFIG = {
  PATTERN: { type: PATTERNS.CROSS, armLength: 1 },
  TRIGGER_THRESHOLD: 1,
  EXPLOSION_RADIUS: 2,
};

export const FUN_MODE_CONFIG = {
  MONKEY: MONKEY_CONFIG,
  CHICKEN: CHICKEN_CONFIG,
  BOMB: BOMB_CONFIG,
};
