import { useState, useEffect } from 'react';

export const useGameSettings = () => {
  const [enableBoardShake, setEnableBoardShake] = useState(() => {
    try {
      const saved = localStorage.getItem('game_enableShake');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [shakeIntensity, setShakeIntensity] = useState(() => {
    try {
      const saved = localStorage.getItem('game_shakeIntensity');
      const val = saved !== null ? JSON.parse(saved) : 2;
      // Migration: Convert old 1-10 scale to new 1-5 scale
      return val > 5 ? Math.round(val / 2) : val;
    } catch {
      return 2;
    }
  });

  const [monkeyAnimationEnabled, setMonkeyAnimationEnabled] = useState(() => {
    try {
      // 1. Try new dedicated key first
      const saved = localStorage.getItem('game_monkeyAnimationEnabled');
      if (saved !== null) return JSON.parse(saved);

      // 2. Fallback to old fun mode settings if new key is missing (migration)
      const rawFunMode = localStorage.getItem('c4_fun_mode_settings_v1');
      if (rawFunMode) {
        const parsed = JSON.parse(rawFunMode);
        if (parsed.monkeyAnimationEnabled !== undefined) {
          return parsed.monkeyAnimationEnabled;
        }
      }
      
      // 3. Final default
      return true;
    } catch {
      return true;
    }
  });

  const saveGameSettings = (newSettings) => {
    if (newSettings.enableBoardShake !== undefined) {
      setEnableBoardShake(newSettings.enableBoardShake);
      localStorage.setItem('game_enableBoardShake', JSON.stringify(newSettings.enableBoardShake));
    }
    if (newSettings.shakeIntensity !== undefined) {
      setShakeIntensity(newSettings.shakeIntensity);
      localStorage.setItem('game_shakeIntensity', newSettings.shakeIntensity.toString());
    }
    if (newSettings.monkeyAnimationEnabled !== undefined) {
      setMonkeyAnimationEnabled(newSettings.monkeyAnimationEnabled);
      localStorage.setItem('game_monkeyAnimationEnabled', JSON.stringify(newSettings.monkeyAnimationEnabled));
    }
  };

  return { 
    enableBoardShake, 
    shakeIntensity, 
    monkeyAnimationEnabled,
    saveGameSettings
  };
};
