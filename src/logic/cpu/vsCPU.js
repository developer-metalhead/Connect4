/**
 * VS CPU CONFIGURATION
 * 
 * This file centralizes all AI-related logic parameters.
 * Original keys are preserved, with human-readable explanations added.
 */

export const CPU_CONFIG = {
  // --- MISTAKE MEMORY (The AI's "Learning" capability) ---
  MEMORY: {
    STORAGE_KEY: "c4_mistake_memory_v1",
    PENALTY_WEIGHT: 25,     // How strongly to avoid moves that led to a loss (The "Grudge" factor)
    MAX_PENALTY: 8,         // Maximum penalty per move (Prevents the AI from becoming too "scared" of a column)
    PENALIZE_LAST_N: 3,     // How many moves back to penalize when the CPU loses
  },

  // --- DIFFICULTY SETTINGS ---
  DIFFICULTY: {
    Novice: {
      MINIMAX_DEPTH: 2,       // How many moves ahead it looks (2 = Shallow/Easy)
      RANDOM_MOVE_CHANCE: 0.4, // 40% chance of a random move (Makes it clumsy/beginner-like)
      BLOCKING_PRIORITY: false, // If false, the AI is "blind" to your 3-in-a-row setups
    },
    Skilled: {
      MINIMAX_DEPTH: 4,       // How many moves ahead it looks (4 = Moderate challenge)
      RANDOM_MOVE_CHANCE: 0,
      BLOCKING_PRIORITY: true, // Actively tries to block your winning moves
    },
    Expert: {
      // Dynamic depth: The AI gets smarter/thinks deeper as the board fills up
      GET_DEPTH: (movesMade) => {
        if (movesMade < 8) return 5;
        if (movesMade < 18) return 6;
        return 7;
      },
      RANDOM_MOVE_CHANCE: 0,
      BLOCKING_PRIORITY: true,
    }
  },

  // --- BOARD EVALUATION (Heuristic Scores) ---
  // Positive numbers = AI wants this. Negative numbers = AI fears/hates this.
  SCORES: {
    WIN: 1000000,           // Immediate Win (Its top priority)
    LOSS: -1000000,         // Immediate Loss (Its top fear)
    THREE_IN_ROW: 120,      // Score for setting up 3 in a row
    TWO_IN_ROW: 12,         // Score for setting up 2 in a row
    OPPONENT_THREE: -130,   // How much it hates the PLAYER having 3 in a row
    OPPONENT_TWO: -14,      // How much it hates the PLAYER having 2 in a row
    CENTER_CONTROL: 4,      // Value of a disc in the middle column (Strategically better)
  },

  // --- OPTIMIZATION ---
  // Checking columns in this order makes the AI calculation much faster
  COLUMN_ORDER: [3, 4, 2, 5, 1, 6, 0]
};
