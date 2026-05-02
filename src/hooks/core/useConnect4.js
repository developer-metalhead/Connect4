import { useState, useCallback } from "react";
import { createInitialState, processMove } from "../../logic/gameEngine";

/**
 * Clean, decoupled hook for 2-Player Local matches.
 */
export const useConnect4 = () => {
  const [gameState, setGameState] = useState(createInitialState);

  const makeMove = useCallback((col) => {
    setGameState(prevState => {
      const nextState = processMove(prevState, col);
      // Only update if the move was actually valid
      return nextState.moveValid ? nextState : prevState;
    });
    
    // Return true/false to let components know if the move was accepted
    return true; 
  }, []);

  const reset = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return { 
    gameState, 
    makeMove, 
    reset 
  };
};
