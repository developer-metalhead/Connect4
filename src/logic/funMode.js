/**
 * FUN MODE CONFIGURATION
 * This file centralizes the thresholds and probabilities for all special features.
 */

export const MONKEY_CONFIG = {
  // Number of 3-in-a-row matches required to trigger the Monkey Mayhem button
  TRIGGER_THRESHOLD: 2,
  
  // Chance that the monkey will steal a disc after it appears
  STEAL_PROBABILITY: 0.75,

  // How many turns the board stays upside down after mayhem is activated
  MAYHEM_DURATION: 4,
  
  // Voice lines for the monkey
  VOICE_LINES: [
    "Time to flip things up!",
    "Ooo-ooo! Gravity is my playground!",
    "Board go brrr!",
    "Monkey business time!",
    "Let's turn this upside down!",
  ]
};

export const CHICKEN_CONFIG = {
  // Number of 2x2 squares required to trigger a Chaos Chicken event
  TRIGGER_THRESHOLD: 1,
  
  // Number of 2x2 squares required to trigger a Rooster of Rage event (replaces chicken)
  ROOSTER_THRESHOLD: 2,
  
  // Probability split for poop blocking: 70% chance to target a non-empty column
  POOP_NON_EMPTY_PROBABILITY: 0.70,
  
  // How many turns a column stays blocked by poop
  POOP_BLOCK_DURATION: 3,
  
  // Voice lines for the chicken
  CHICKEN_VOICE_LINES: [
    "Bawk bawk! Chaos time!",
    "Cluck cluck! Here comes trouble!",
    "Chicken alert! Incoming poop!",
    "Feathers flying everywhere!",
    "Time to ruffle some feathers!",
  ],
  
  // Voice lines for the rooster
  ROOSTER_VOICE_LINES: [
    "RAAAWR! Rooster of Rage!",
    "COCK-A-DOODLE-DOOM!",
    "Fire and fury unleashed!",
    "Behold the mighty rooster!",
    "Rage mode activated!",
  ]
};

export const FUN_MODE_CONFIG = {
  MONKEY: MONKEY_CONFIG,
  CHICKEN: CHICKEN_CONFIG,
};
