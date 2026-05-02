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

  useEffect(() => {
    localStorage.setItem('board_enableShake', JSON.stringify(enableBoardShake));
  }, [enableBoardShake]);

  useEffect(() => {
    localStorage.setItem('board_shakeIntensity', JSON.stringify(shakeIntensity));
  }, [shakeIntensity]);

  return { enableBoardShake, setEnableBoardShake, shakeIntensity, setShakeIntensity };
};
