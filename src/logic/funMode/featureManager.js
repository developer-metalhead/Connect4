import { detectPattern } from "../../helperFunction/funMode/patternBridge";
import { ACTIONS, executeGravityFlip, executeRemoveDisc, executeBlockColumn, executeExplosion } from "./actionEngine";
import { EMOJIS } from "../core/coreConfig";

/**
 * THE FEATURE MANAGER (PHASE 3: EVOLVED)
 * Tracks feature progression (Rooster Threshold) and executes the correct action set.
 */

class FeatureManager {
  constructor() {
    this.activeFeatures = [];
    this.eventListeners = [];
    
    // NEW: Tracks how many times each player triggered which feature
    // Format: { 'CHICKEN': { '🔴': 1, '🟡': 0 } }
    this.featureState = {};
  }

  getFeatureStats(featureName) {
    return this.featureState[featureName] || { [EMOJIS.RED_DISC]: 0, [EMOJIS.YELLOW_DISC]: 0 };
  }

  registerFeature(config) {
    if (!this.activeFeatures.find(f => f.NAME === config.NAME)) {
      this.activeFeatures.push(config);
      this.featureState[config.NAME] = {};
    }
  }

  subscribe(callback) {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== callback);
    };
  }

  notify(event) {
    this.eventListeners.forEach(listener => listener(event));
  }

  /**
   * SCANNING & EVOLUTION PHASE
   */
  processMove(board, lastRow, lastCol, lastPlayer) {
    const triggers = [];
    
    for (const feature of this.activeFeatures) {
      const matches = detectPattern(board, lastRow, lastCol, lastPlayer, feature.PATTERN);
      
      if (matches.length > 0) {
        // Increment the trigger count for this specific player
        const playerCount = (this.featureState[feature.NAME][lastPlayer] || 0) + 1;
        this.featureState[feature.NAME][lastPlayer] = playerCount;

        // --- EVOLUTION LOGIC ---
        // Determine if we should use Base Actions or Ultimate Actions
        let actionSet = feature.ACTIONS;
        let isUltimate = false;

        if (feature.ULTIMATE_ACTIONS && playerCount >= (feature.ULTIMATE_THRESHOLD || 2)) {
          actionSet = feature.ULTIMATE_ACTIONS;
          isUltimate = true;
          // Optionally reset if configured (Chaos Chicken style)
          if (feature.RESET_AFTER_ROOSTER) {
            this.featureState[feature.NAME][lastPlayer] = 0;
          }
        }

        triggers.push({
          featureName: feature.NAME,
          actions: actionSet || [], 
          isUltimate, // Useful for the UI to know it's Rooster Mode
          coordinates: matches[0],
          config: feature,
          player: lastPlayer
        });
      }
    }

    if (triggers.length > 0) {
      this.notify({ type: "FEATURE_TRIGGERED", triggers });
    }
    
    return triggers;
  }

  /**
   * EXECUTION PHASE
   */
  executeAction(actionObj, params) {
    const { board, gravity, blockedColumns, centerRow, centerCol } = params;

    switch (actionObj.type) {
      case ACTIONS.GRAVITY_FLIP:
        return { 
          type: ACTIONS.GRAVITY_FLIP, 
          newGravity: executeGravityFlip(gravity) 
        };

      case ACTIONS.REMOVE_DISC:
        // Pass the entire action object (contains Sacred Names like ROOSTER_STRIKE_PROBABILITY)
        const { newBoard: boardAfterRemoval, removed } = executeRemoveDisc(board, actionObj);
        return { 
          type: ACTIONS.REMOVE_DISC, 
          newBoard: boardAfterRemoval, 
          targetDisc: removed 
        };

      case ACTIONS.BLOCK_COLUMN:
        // Pass the projectile from params so the state knows what emoji to use!
        const { targetCol, blockedColumns: newBlocked } = executeBlockColumn(board, blockedColumns, {
          ...actionObj,
          projectile: params.projectile
        });
        return { 
          type: ACTIONS.BLOCK_COLUMN, 
          targetCol, 
          blockedColumns: newBlocked 
        };

      case ACTIONS.EXPLODE:
        const { newBoard: boardAfterExplosion, removed: explodedDiscs } = executeExplosion(board, centerRow, centerCol, actionObj);
        return { 
          type: ACTIONS.EXPLODE, 
          newBoard: boardAfterExplosion, 
          explodedDiscs 
        };

      default:
        return null;
    }
  }
}

export const featureManager = new FeatureManager();
