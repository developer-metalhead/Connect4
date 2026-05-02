import React, { useEffect, useState } from 'react';
import { featureManager } from '../../logic/funMode/featureManager';
import { ACTIONS } from '../../logic/funMode/actionEngine';
import { FEATURES, EMOJIS } from '../../logic/core/coreConfig';
import FeatureAnimation from './FeatureAnimation';

/**
 * THE FEATURE DISPATCHER (PHASE 3: DYNAMIC PROJECTILES)
 */
const FeatureDispatcher = ({ 
  gameState, 
  setGameState, 
  gravity, 
  setGravity, 
  setTurnsLeft,
  blockedColumns, 
  setBlockedColumns,
  soundManager,
  startAnimation,
  isAnimating,
  onAnimationComplete
}) => {
  const [activeVisuals, setActiveVisuals] = useState({
    actor: "",
    projectile: "",
    voice: "",
    targetColumn: null
  });

  useEffect(() => {
    const unsubscribe = featureManager.subscribe((event) => {
      if (event.type === "FEATURE_TRIGGERED") {
        event.triggers.forEach(trigger => {
          trigger.actions.forEach(actionObj => {
            handleTrigger(trigger, actionObj);
          });
        });
      }
    });
    return unsubscribe;
  }, [gameState, gravity, blockedColumns]);

  const handleTrigger = (trigger, actionObj) => {
    const { config, coordinates, featureName, isUltimate } = trigger;
    
    // 1. EXECUTION
    const result = featureManager.executeAction(actionObj, {
      board: gameState.board,
      gravity,
      blockedColumns,
      centerRow: coordinates.row,
      centerCol: coordinates.col,
      // NEW: Pass the character's projectile emoji to the logic engine!
      projectile: config.PROJECTILE 
    });

    if (!result) return;

    // 2. VISUAL SETUP
    const actorEmoji = isUltimate ? (featureName === FEATURES.CHICKEN ? EMOJIS.ROOSTER : config.ACTOR) : config.ACTOR;
    const voiceLines = isUltimate ? (config.ROOSTER_VOICE_LINES || [""]) : (config.CHICKEN_VOICE_LINES || [""]);
    const randomVoice = voiceLines[Math.floor(Math.random() * voiceLines.length)];
    
    setActiveVisuals({
      actor: actorEmoji,
      projectile: isUltimate ? EMOJIS.FIRE : config.PROJECTILE,
      voice: randomVoice,
      targetColumn: actionObj.type === ACTIONS.BLOCK_COLUMN ? result.targetCol : (actionObj.type === ACTIONS.REMOVE_DISC ? result.targetDisc?.c : null)
    });

    // 3. TRIGGER ANIMATION & SOUND
    startAnimation(featureName, 2500);
    
    if (soundManager) {
      if (isUltimate && featureName === FEATURES.CHICKEN) soundManager.playSound("rooster");
      else soundManager.playSound(featureName === FEATURES.MONKEY ? "monkeylaugh" : "chickenbawk");
    }

    // 4. ACTION SIDE EFFECTS
    switch (actionObj.type) {
      case ACTIONS.GRAVITY_FLIP:
        setTurnsLeft(prev => ({ ...prev, gravity: actionObj.MAYHEM_DURATION || 4 }));
        setTimeout(() => setGravity(result.newGravity), 1000);
        break;

      case ACTIONS.REMOVE_DISC:
        if (result.targetDisc) {
          setTimeout(() => setGameState(prev => ({ ...prev, board: result.newBoard })), 1200);
        }
        break;

      case ACTIONS.BLOCK_COLUMN:
        // The result.blockedColumns now contains the projectile emoji!
        setTimeout(() => setBlockedColumns(result.blockedColumns), 1200);
        break;

      case ACTIONS.EXPLODE:
        if (soundManager) soundManager.playSound("bomb_explosion");
        setGameState(prev => ({ ...prev, board: result.newBoard }));
        break;
        
      default:
        break;
    }
  };

  return (
    <FeatureAnimation 
      isAnimating={isAnimating}
      actor={activeVisuals.actor}
      projectile={activeVisuals.projectile}
      voiceLine={activeVisuals.voice}
      targetColumn={activeVisuals.targetColumn}
      onAnimationComplete={onAnimationComplete}
    />
  );
};

export default FeatureDispatcher;
