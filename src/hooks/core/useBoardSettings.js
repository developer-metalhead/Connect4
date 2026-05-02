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

  useEffect(() => {
    localStorage.setItem('board_enableShake', JSON.stringify(enableBoardShake));
  }, [enableBoardShake]);

  return { enableBoardShake, setEnableBoardShake };
};
