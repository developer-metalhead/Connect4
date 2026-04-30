import { useState, useCallback } from "react";
import {
  shouldTriggerChaosChicken,
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
    
    const newActivations = chaosChickenState.activations + 1;
    const shouldEvolve = newActivations >= 2 && !chaosChickenState.isEvolved;
    const isRooster = chaosChickenState.isEvolved || shouldEvolve;
    
    const voiceLine = getRandomChickenVoiceLine(isRooster);
    setChickenVoiceLine(voiceLine);

    // Update state
    setChaosChickenState(prev => ({
      ...prev,
      activations: newActivations,
      isEvolved: shouldEvolve || prev.isEvolved,
      lastTriggeredBy: triggeringPlayer,
    }));

    let newBoard = board;
    let newBlockedColumns = blockedColumns;

    // Determine action based on evolution state
    if (isRooster) {
      // Rooster of Rage: Wipe a row
      setChickenAction('wipe');
      newBoard = wipeRandomRow(board);
      console.log("🔥 ROOSTER OF RAGE WIPED A ROW");
    } else {
      // Regular chicken: Block a column
      setChickenAction('poop');
      newBlockedColumns = blockRandomColumn(blockedColumns);
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
    setBlockedColumns(prev => decreaseBlockedColumnTimers(prev));
  }, []);

  // CHANGE: Check if a move is valid considering blocked columns
  const isValidMove = useCallback((board, col, isUpsideDown = false) => {
    return isValidDropWithPoop(board, col, blockedColumns, isUpsideDown);
  }, [blockedColumns]);

  // CHANGE: Find alternative column if preferred is blocked
  const getAlternativeColumn = useCallback((board, preferredCol, isUpsideDown = false) => {
    return findNextAvailableColumn(board, preferredCol, blockedColumns, isUpsideDown);
  }, [blockedColumns]);

  // CHANGE: Reset chaos chicken state
  const reset = useCallback(() => {
    setChaosChickenState({
      activations: 0,
      isEvolved: false,
      lastTriggeredBy: null,
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