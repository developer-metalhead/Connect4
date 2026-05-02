import { useState, useEffect } from 'react';

export const useBoardSettings = () => {
  const [enableBoardShake, setEnableBoardShake] = useState(() => {
    try {
      const saved = localStorage.getItem('board_enableShake');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [shakeIntensity, setShakeIntensity] = useState(() => {
    try {
      const saved = localStorage.getItem('board_shakeIntensity');
      return saved !== null ? JSON.parse(saved) : 5;
    } catch {
      return 5;
    }
  });

  const saveBoardSettings = (newSettings) => {
    if (newSettings.enableBoardShake !== undefined) {
      setEnableBoardShake(newSettings.enableBoardShake);
      localStorage.setItem('board_enableShake', JSON.stringify(newSettings.enableBoardShake));
    }
    if (newSettings.shakeIntensity !== undefined) {
      setShakeIntensity(newSettings.shakeIntensity);
      localStorage.setItem('board_shakeIntensity', JSON.stringify(newSettings.shakeIntensity));
    }
  };

  return { 
    enableBoardShake, 
    shakeIntensity, 
    saveBoardSettings 
  };
};
