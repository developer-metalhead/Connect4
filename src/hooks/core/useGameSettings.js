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
      return saved !== null ? JSON.parse(saved) : 2;
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

  useEffect(() => {
    localStorage.setItem('game_enableShake', JSON.stringify(enableBoardShake));
  }, [enableBoardShake]);

  useEffect(() => {
    localStorage.setItem('game_shakeIntensity', JSON.stringify(shakeIntensity));
  }, [shakeIntensity]);

  useEffect(() => {
    localStorage.setItem('game_monkeyAnimationEnabled', JSON.stringify(monkeyAnimationEnabled));
  }, [monkeyAnimationEnabled]);

  return { 
    enableBoardShake, setEnableBoardShake, 
    shakeIntensity, setShakeIntensity,
    monkeyAnimationEnabled, setMonkeyAnimationEnabled 
  };
};
