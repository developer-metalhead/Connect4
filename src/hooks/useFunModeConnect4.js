import { useState, useCallback, useRef } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
} from "../helperFunction/helperFunction";
import {
  shouldTriggerMonkeyMayhem,
  flipBoardUpsideDown,
  maybeStealDisc,
  getRandomMonkeyVoiceLine,
  isMonkeyWinner
} from "../helperFunction/funModeFeatures";

export const useFunModeConnect4 = () => {
  const [gameState, setGameState] = useState(resetGame);
  const [showMonkeyButton, setShowMonkeyButton] = useState(false);
  const [monkeyButtonPlayer, setMonkeyButtonPlayer] = useState(null);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [upsideDownTurnsLeft, setUpsideDownTurnsLeft] = useState(0);
  const [usedMonkeyMayhem, setUsedMonkeyMayhem] = useState(new Set());
  const [isMonkeyAnimating, setIsMonkeyAnimating] = useState(false);
  const [monkeyVoiceLine, setMonkeyVoiceLine] = useState("");
  
  const monkeyButtonTimerRef = useRef(null);

  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      if (winner || isDraw || !isValidMove(board, col) || isMonkeyAnimating) return false;

      const { newBoard, row } = dropPiece(board, col, currentPlayer);
      let newState = { ...gameState, board: newBoard };

      // Check for win
      if (checkWin(newBoard, row, col, currentPlayer)) {
        newState.winner = currentPlayer;
        
        // Check if it's a monkey winner
        if (isMonkeyWinner(currentPlayer, isUpsideDown)) {
          newState.isMonkeyWinner = true;
        }
      } else if (isBoardFull(newBoard)) {
        newState.isDraw = true;
      } else {
        newState.currentPlayer = getNextPlayer(currentPlayer);
      }

      setGameState(newState);

      // Handle upside-down mode turn countdown
      if (isUpsideDown && upsideDownTurnsLeft > 0) {
        const newTurnsLeft = upsideDownTurnsLeft - 1;
        setUpsideDownTurnsLeft(newTurnsLeft);
        
        if (newTurnsLeft === 0) {
          // Flip back to normal
          setTimeout(() => {
            setIsMonkeyAnimating(true);
            setMonkeyVoiceLine("Phew! Back to normal!");
            
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                board: flipBoardUpsideDown(prev.board)
              }));
              setIsUpsideDown(false);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");
            }, 2500);
          }, 500);
        }
      }

      // Check for Monkey Mayhem trigger (only if not already in upside-down mode)
      if (!newState.winner && !newState.isDraw && !isUpsideDown && !isMonkeyAnimating) {
        if (shouldTriggerMonkeyMayhem(newBoard, currentPlayer, usedMonkeyMayhem)) {
          setShowMonkeyButton(true);
          setMonkeyButtonPlayer(currentPlayer);
          
          // Auto-hide button after 10 seconds
          monkeyButtonTimerRef.current = setTimeout(() => {
            setShowMonkeyButton(false);
            setMonkeyButtonPlayer(null);
          }, 10000);
        }
      }

      return true;
    },
    [gameState, isUpsideDown, upsideDownTurnsLeft, usedMonkeyMayhem, isMonkeyAnimating],
  );

  const triggerMonkeyMayhem = useCallback(() => {
    if (!showMonkeyButton || !monkeyButtonPlayer || isMonkeyAnimating) return;

    // Clear the timer
    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
    }

    // Hide button
    setShowMonkeyButton(false);
    
    // Mark this player as having used Monkey Mayhem
    setUsedMonkeyMayhem(prev => new Set([...prev, monkeyButtonPlayer]));
    
    // Start animation sequence
    setIsMonkeyAnimating(true);
    setMonkeyVoiceLine(getRandomMonkeyVoiceLine());
    
    // After animation completes, flip the board
    setTimeout(() => {
      setGameState(prev => {
        let flippedBoard = flipBoardUpsideDown(prev.board);
        flippedBoard = maybeStealDisc(flippedBoard); // Chance to steal a disc
        
        return {
          ...prev,
          board: flippedBoard
        };
      });
      
      setIsUpsideDown(true);
      setUpsideDownTurnsLeft(6); // 3 turns for each player = 6 total moves
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
    }, 2500); // Animation duration
  }, [showMonkeyButton, monkeyButtonPlayer, isMonkeyAnimating]);

  const reset = useCallback(() => {
    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
    }
    
    setGameState(resetGame());
    setShowMonkeyButton(false);
    setMonkeyButtonPlayer(null);
    setIsUpsideDown(false);
    setUpsideDownTurnsLeft(0);
    setUsedMonkeyMayhem(new Set());
    setIsMonkeyAnimating(false);
    setMonkeyVoiceLine("");
  }, []);

  return {
    gameState,
    makeMove,
    reset,
    showMonkeyButton,
    monkeyButtonPlayer,
    triggerMonkeyMayhem,
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    monkeyVoiceLine,
    usedMonkeyMayhem
  };
};