import { useEffect, useState } from 'react';

export const useFunModeEffects = ({
  showMonkeyButton,
  winner,
  isDraw,
  isMonkeyWinner,
  isMonkeyAnimating,
  monkeyVoiceLine,
  soundManager
}) => {
  const [monkeyButtonTimer, setMonkeyButtonTimer] = useState(10);

  // CHANGE: Moved monkey button timer logic to custom hook
  useEffect(() => {
    if (showMonkeyButton) {
      console.log("⏰ STARTING MONKEY BUTTON TIMER");
      setMonkeyButtonTimer(10);
      const interval = setInterval(() => {
        setMonkeyButtonTimer((prev) => {
          const newTime = prev - 1;
          console.log("⏰ MONKEY BUTTON TIMER:", newTime);
          if (newTime <= 0) {
            console.log("⏰ MONKEY BUTTON TIMER EXPIRED");
            clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => {
        console.log("⏰ CLEANING UP MONKEY BUTTON TIMER");
        clearInterval(interval);
      };
    }
  }, [showMonkeyButton]);

  // CHANGE: Moved sound effects to custom hook
  useEffect(() => {
    if (winner) {
      if (isMonkeyWinner) {
        soundManager.playWinSound();
        setTimeout(() => soundManager.playSound("click"), 500);
      } else {
        soundManager.playWinSound();
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, isMonkeyWinner, soundManager]);

  // CHANGE: Moved animation sound effects to custom hook
  useEffect(() => {
    if (isMonkeyAnimating && monkeyVoiceLine) {
      soundManager.playSound("click");
    }
  }, [isMonkeyAnimating, monkeyVoiceLine, soundManager]);

  return { monkeyButtonTimer };
};