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

  const [seriousCPU, setSeriousCPU] = useState(() => {
    try {
      const saved = localStorage.getItem('game_seriousCPU');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const saveCPUSettings = useCallback((newSettings) => {
    if (newSettings.difficulty !== undefined) {
      setDifficulty(newSettings.difficulty);
      localStorage.setItem('game_cpuDifficulty', JSON.stringify(newSettings.difficulty));
    }
    if (newSettings.seriousCPU !== undefined) {
      setSeriousCPU(newSettings.seriousCPU);
      localStorage.setItem('game_seriousCPU', JSON.stringify(newSettings.seriousCPU));
    }
  }, []);

  return { 
    difficulty, 
    seriousCPU,
    saveCPUSettings,
    saveDifficulty: (d) => saveCPUSettings({ difficulty: d })
  };
};

export default useCPUSettings;
