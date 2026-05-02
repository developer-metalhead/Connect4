import { useState, useCallback, useRef } from "react";
import {
  shouldTriggerChaosChicken,
  getRandomChickenVoiceLine,
  getRandomRoosterVoiceLine,
  getRandomUnblockedColumn,
  blockColumn,
  updateBlockedColumns,
  isColumnBlocked,
  selectNonEmptyRowForRooster,
  clearOpponentDiscsInRow,
  applyGravityAfterClear,
  isRoosterOfRageActivation,
  findNearestAvailableColumn,
} from "../../helperFunction/funMode/chaosChickenFeatures";
import { CHICKEN_CONFIG } from "../../logic/funMode";

export const useChaosChicken = (options = {}) => {
  const { chaosChickenEnabled = true } = options;

  const [chaosChickenState, setChaosChickenState] = useState({
    chickenActivations: { player1: 0, player2: 0 },
    roosterCount: { player1: 0, player2: 0 },
  });

  const [blockedColumns, setBlockedColumns] = useState([]);
  const [isChickenAnimating, setIsChickenAnimating] = useState(false);
  const [chickenVoiceLine, setChickenVoiceLine] = useState("");
  const [isRoosterMode, setIsRoosterMode] = useState(false);
  const [targetColumn, setTargetColumn] = useState(null);

  const animationTimeoutRef = useRef(null);

  const checkChaosChickenTrigger = useCallback(
    (board, lastRow, lastCol, player) => {
      if (!chaosChickenEnabled) return false;
      return shouldTriggerChaosChicken(
        board,
        lastRow,
        lastCol,
        player,
        chaosChickenState
      );
    },
    [chaosChickenEnabled, chaosChickenState]
  );

  const triggerChaosChicken = useCallback(
    (board, player, soundManager, onBoardUpdate, isUpsideDown = false) => {
      if (!chaosChickenEnabled || isChickenAnimating) return;

      const playerKey = player === "🔴" ? "player1" : "player2";
      const willBeRooster = isRoosterOfRageActivation(chaosChickenState, player);

      console.log(`🐔 TRIGGERING ${willBeRooster ? "ROOSTER" : "CHICKEN"} FOR:`, player);

      // Play appropriate sound
      if (soundManager) {
        if (willBeRooster) {
          soundManager.playSound("rooster"); 
        } else {
          soundManager.playSound("chickenbawk"); 
        }
      }

      // Update state
      setChaosChickenState((prev) => {
        const nextActivations = willBeRooster && CHICKEN_CONFIG.RESET_AFTER_ROOSTER
          ? 0 
          : prev.chickenActivations[playerKey] + 1;
        
        const nextRoosterCount = willBeRooster 
          ? prev.roosterCount[playerKey] + 1 
          : prev.roosterCount[playerKey];

        return {
          ...prev,
          chickenActivations: {
            ...prev.chickenActivations,
            [playerKey]: nextActivations,
          },
          roosterCount: {
            ...prev.roosterCount,
            [playerKey]: nextRoosterCount
          }
        };
      });

      // Start animation
      setIsChickenAnimating(true);
      setIsRoosterMode(willBeRooster);

      if (willBeRooster) {
        // Rooster of Rage
        setChickenVoiceLine(getRandomRoosterVoiceLine());
        setTargetColumn(null);

        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        animationTimeoutRef.current = setTimeout(() => {
          const selectedRow = selectNonEmptyRowForRooster(board);
          const { newBoard, clearedCount } = clearOpponentDiscsInRow(board, selectedRow, player);

          if (clearedCount > 0 && options.onOverlayShow) {
            const opponentPlayer = player === "🔴" ? "🟡" : "🔴";
            soundManager?.playSound('coinsfalling');
            options.onOverlayShow({
              type: "rooster",
              count: clearedCount,
              row: selectedRow,
              player: opponentPlayer
            });
          }

          if (clearedCount > 0 || selectedRow !== -1) {
            const finalBoard = applyGravityAfterClear(newBoard, isUpsideDown);
            onBoardUpdate(finalBoard);
          }

          setIsChickenAnimating(false);
          setChickenVoiceLine("");
          setIsRoosterMode(false);
        }, 3000);
      } else {
        // Regular chicken
        setChickenVoiceLine(getRandomChickenVoiceLine());

        const columnToBlock = getRandomUnblockedColumn(blockedColumns, board);
        if (columnToBlock !== null) {
          setTargetColumn(columnToBlock);
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }

          animationTimeoutRef.current = setTimeout(() => {
            setBlockedColumns((prev) => blockColumn(prev, columnToBlock));
            setIsChickenAnimating(false);
            setChickenVoiceLine("");
            setTargetColumn(null);
          }, 2500);
        } else {
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }
          animationTimeoutRef.current = setTimeout(() => {
            setIsChickenAnimating(false);
            setChickenVoiceLine("");
            setTargetColumn(null);
          }, 2500);
        }
      }
    },
    [
      chaosChickenEnabled,
      isChickenAnimating,
      chaosChickenState,
      blockedColumns,
      options.onOverlayShow
    ]
  );

  const updateTurnBasedBlocks = useCallback(() => {
    setBlockedColumns((prev) => updateBlockedColumns(prev));
  }, []);

  const handleBlockedColumnDrop = useCallback(
    (board, targetCol, player, isUpsideDown = false) => {
      if (!isColumnBlocked(blockedColumns, targetCol)) {
        return targetCol; // Column is not blocked
      }

      console.log("💩 COLUMN IS BLOCKED, FINDING ALTERNATIVE:", targetCol);

      // Find nearest available column
      const nearestCol = findNearestAvailableColumn(
        board,
        targetCol,
        blockedColumns,
        isUpsideDown
      );

      if (nearestCol === -1) {
        console.log("❌ NO AVAILABLE COLUMNS FOUND");
        return -1; // No available columns
      }

      console.log("✅ REDIRECTING TO NEAREST COLUMN:", nearestCol);
      return nearestCol;
    },
    [blockedColumns]
  );

  const reset = useCallback(() => {
    console.log("🔄 RESETTING CHAOS CHICKEN STATE");

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    setChaosChickenState({
      chickenActivations: { player1: 0, player2: 0 },
      hasUsedRooster: { player1: false, player2: false },
    });

    setBlockedColumns([]);
    setIsChickenAnimating(false);
    setChickenVoiceLine("");
    setIsRoosterMode(false);
    setTargetColumn(null);
  }, []);

  return {
    chaosChickenState,
    blockedColumns,
    isChickenAnimating,
    chickenVoiceLine,
    isRoosterMode,
    targetColumn,
    checkChaosChickenTrigger,
    triggerChaosChicken,
    updateTurnBasedBlocks,
    handleBlockedColumnDrop,
    isColumnBlocked: (col) => isColumnBlocked(blockedColumns, col),
    reset,
  };
};