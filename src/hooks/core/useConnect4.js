import { useState, useCallback } from "react";
import { createInitialState, processMove } from "../../logic/core/gameEngine";

/**
 * Hook for a standard 2-Player Local Connect 4 game.
 * Completely decoupled from game-mode configurations.
 */
export const useConnect4 = () => {
  const [gameState, setGameState] = useState(createInitialState);

  const makeMove = useCallback((col) => {
    setGameState(prevState => {
      const nextState = processMove(prevState, col);
      return nextState.moveValid ? nextState : prevState;
    });
    return true; 
  }, []);

  const reset = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return {
    gameState,
    makeMove,
    reset,
  };
};
