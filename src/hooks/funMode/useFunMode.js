import { useState, useCallback, useEffect } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
} from "../../helperFunction/helperFunction";
import { featureManager } from "../../logic/funMode/featureManager";
import { MONKEY_CONFIG, CHICKEN_CONFIG, BOMB_CONFIG } from "../../logic/funMode/funMode";

/**
 * HOOK: useFunMode (PHASE 3: THE MODULAR ENGINE)
 * The unified hook for all game modes using the Feature Manager.
 * Now supports "Turn-Based Effects" (like gravity countdowns).
 */
export const useFunMode = (options = {}) => {
  const { 
    enableExtensions = true,
  } = options;

  // --- CORE GAME STATE ---
  const [gameState, setGameState] = useState(resetGame);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // --- MODULAR FEATURE STATE ---
  const [gravity, setGravity] = useState("normal");
  const [blockedColumns, setBlockedColumns] = useState([]);
  const [turnsLeft, setTurnsLeft] = useState({ gravity: 0 }); // Countdown for temporary effects

  // Setup: Register all features on mount
  useEffect(() => {
    if (enableExtensions) {
      featureManager.registerFeature(MONKEY_CONFIG);
      featureManager.registerFeature(CHICKEN_CONFIG);
      featureManager.registerFeature(BOMB_CONFIG);
    }
  }, [enableExtensions]);

  /**
   * THE MOVE DISPATCHER
   */
  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      if (winner || isDraw || isAnimating || !isValidMove(board, col)) return false;

      // 1. Core Move
      const { newBoard, row } = dropPiece(board, col, currentPlayer);
      if (row === -1) return false;

      // 2. Feature Processing (THE BRAIN)
      if (enableExtensions) {
        featureManager.processMove(newBoard, row, col, currentPlayer);
      }

      // 3. Turn-Based Maintenance (NEW: Auto-decrement counts)
      updateTurnEffects();

      // 4. State Update & Win Detection
      let newState = { ...gameState, board: newBoard };
      const winResult = checkWin(newBoard, row, col, currentPlayer);
      
      if (winResult) {
        newState.winner = currentPlayer;
        newState.winningLine = winResult;
      } else if (isBoardFull(newBoard)) {
        newState.isDraw = true;
      } else {
        newState.currentPlayer = getNextPlayer(currentPlayer);
      }

      setGameState(newState);
      return true;
    },
    [gameState, isAnimating, enableExtensions]
  );

  /**
   * Maintenance: Decrement all active countdowns
   */
  const updateTurnEffects = () => {
    // 1. Handle Gravity Flip countdown
    setTurnsLeft(prev => {
      const nextGravity = Math.max(0, prev.gravity - 1);
      if (nextGravity === 0 && gravity === "inverted") {
        setGravity("normal"); // Auto-restore gravity when time is up
      }
      return { ...prev, gravity: nextGravity };
    });

    // 2. Handle Blocked Columns countdown
    setBlockedColumns(prev => 
      prev.map(col => ({ ...col, turnsLeft: col.turnsLeft - 1 }))
          .filter(col => col.turnsLeft > 0)
    );
  };

  const startAnimation = useCallback((key, duration = 2500) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }, []);

  const reset = useCallback(() => {
    setGameState(resetGame());
    setIsAnimating(false);
    setGravity("normal");
    setBlockedColumns([]);
    setTurnsLeft({ gravity: 0 });
  }, []);

  const getStats = useCallback((featureName) => {
    return featureManager.getFeatureStats(featureName);
  }, []);

  return {
    gameState,
    isAnimating,
    gravity,
    blockedColumns,
    turnsLeft,
    makeMove,
    reset,
    getStats,
    setGameState,
    setGravity,
    setBlockedColumns,
    setTurnsLeft,
    startAnimation
  };
};