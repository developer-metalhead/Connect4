import { useState, useCallback } from 'react';

export const useCPUSettings = () => {
  const [difficulty, setDifficulty] = useState(() => {
    try {
      const saved = localStorage.getItem('game_cpuDifficulty');
      return saved !== null ? JSON.parse(saved) : 'Expert';
    } catch {
      return 'Expert';
    }
  });

  const saveDifficulty = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
    localStorage.setItem('game_cpuDifficulty', JSON.stringify(newDifficulty));
  }, []);

  return { 
    difficulty, 
    saveDifficulty 
  };
};

export default useCPUSettings;
