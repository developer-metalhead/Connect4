import { useState, useCallback } from "react";
import {
  shouldTriggerChaosChicken,
  shouldTriggerRoosterOfRage,
  blockRandomColumn,
  wipeRandomRow,
  decreaseBlockedColumnTimers,
  getRandomChickenVoiceLine,
  findNextAvailableColumn,
  isValidDropWithPoop,
} from "../../helperFunction/funMode/chaosChickenFeatures";


export const useChaosChicken = (options = {}) => {
  const { chaosChickenEnabled = true } = options;
  
  const [chaosChickenState, setChaosChickenState] = useState({
    activations: 0,
    isEvolved: false,
    lastTriggeredBy: null,
    hasTriggeredChaosChicken: {}, // CHANGE: Track per player: { "🔴": true, "🟡": false }
  });

  
  const [blockedColumns, setBlockedColumns] = useState([]);
  const [isChickenAnimating, setIsChickenAnimating] = useState(false);
  const [chickenVoiceLine, setChickenVoiceLine] = useState("");
  const [chickenAction, setChickenAction] = useState(null); // 'poop' or 'wipe'

  // CHANGE: Check if chaos chicken should trigger after a move
  const checkChaosChickenTrigger = useCallback((board, currentPlayer) => {
    if (!chaosChickenEnabled || isChickenAnimating) {
      return false;
    }

    if (shouldTriggerChaosChicken(board, currentPlayer, chaosChickenState)) {
      console.log("🐔 CHAOS CHICKEN TRIGGERED FOR:", currentPlayer);
      return true;
    }

    return false;
  }, [chaosChickenEnabled, chaosChickenState, isChickenAnimating]);

  // CHANGE: Trigger chaos chicken animation and effects
  const triggerChaosChicken = useCallback((board, triggeringPlayer) => {
    if (!chaosChickenEnabled) return { newBoard: board, blockedColumns };

    setIsChickenAnimating(true);
    
    // CHANGE: Check if this should be Rooster of Rage (2+ squares) or regular Chaos Chicken (1 square)
    const isRooster = shouldTriggerRoosterOfRage(board, triggeringPlayer);
    
    const voiceLine = getRandomChickenVoiceLine(isRooster);
    setChickenVoiceLine(voiceLine);

    // CHANGE: Update state with per-player activation tracking
    setChaosChickenState(prev => ({
      ...prev,
      activations: prev.activations + 1,
      isEvolved: isRooster || prev.isEvolved,
      lastTriggeredBy: triggeringPlayer,
      hasTriggeredChaosChicken: {
        ...prev.hasTriggeredChaosChicken,
        [triggeringPlayer]: true, // CHANGE: Mark this player as having triggered
      },
    }));


    let newBoard = board;
    let newBlockedColumns = blockedColumns;

    // CHANGE: Determine action based on square count (1 vs 2+)
    if (isRooster) {
      // Rooster of Rage: Wipe a row (only opponent pieces)
      setChickenAction('wipe');
      newBoard = wipeRandomRow(board, triggeringPlayer);
      console.log("🔥 ROOSTER OF RAGE WIPED A ROW");
    } else {
      // Regular chicken: Block a column
      setChickenAction('poop');
      newBlockedColumns = blockRandomColumn(blockedColumns);
      // CHANGE: Update the state immediately to persist blocked columns
      setBlockedColumns(newBlockedColumns);
      console.log("💩 CHICKEN BLOCKED A COLUMN");
    }


    // Clear animation after delay
    setTimeout(() => {
      setIsChickenAnimating(false);
      setChickenVoiceLine("");
      setChickenAction(null);
    }, 3000);

    return { newBoard, blockedColumns: newBlockedColumns };
  }, [chaosChickenEnabled, chaosChickenState, blockedColumns]);

  // CHANGE: Decrease blocked column timers at end of turn
  const endTurn = useCallback(() => {
    setBlockedColumns(prev => {
      const updated = decreaseBlockedColumnTimers(prev);
      return updated;
    });
  }, []);


  // CHANGE: Check if a move is valid considering blocked columns and current player
  const isValidMove = useCallback((board, col, isUpsideDown = false, currentPlayer = null) => {
    // CHANGE: Pass current player and last triggering player to check if column should be blocked
    return isValidDropWithPoop(board, col, blockedColumns, isUpsideDown, currentPlayer, chaosChickenState.lastTriggeredBy);
  }, [blockedColumns, chaosChickenState.lastTriggeredBy]);


  // CHANGE: Find alternative column if preferred is blocked
  const getAlternativeColumn = useCallback((board, preferredCol, isUpsideDown = false, currentPlayer = null) => {
    return findNextAvailableColumn(board, preferredCol, blockedColumns, isUpsideDown, currentPlayer, chaosChickenState.lastTriggeredBy);
  }, [blockedColumns, chaosChickenState.lastTriggeredBy]);


  // CHANGE: Reset chaos chicken state
  const reset = useCallback(() => {
    setChaosChickenState({
      activations: 0,
      isEvolved: false,
      lastTriggeredBy: null,
      hasTriggeredChaosChicken: {}, // CHANGE: Reset per-player tracking
    });
    setBlockedColumns([]);
    setIsChickenAnimating(false);
    setChickenVoiceLine("");
    setChickenAction(null);
  }, []);


  return {
    chaosChickenState,
    blockedColumns,
    isChickenAnimating,
    chickenVoiceLine,
    chickenAction,
    checkChaosChickenTrigger,
    triggerChaosChicken,
    endTurn,
    isValidMove,
    getAlternativeColumn,
    reset,
  };
};