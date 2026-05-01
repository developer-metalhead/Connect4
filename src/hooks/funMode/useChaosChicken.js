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

export const useChaosChicken = (options = {}) => {
  const { chaosChickenEnabled = true } = options;

  const [chaosChickenState, setChaosChickenState] = useState({
    chickenActivations: { player1: 0, player2: 0 },
    hasUsedRooster: { player1: false, player2: false },
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

      console.log("🐔 CHECKING CHAOS CHICKEN TRIGGER:", {
        player,
        lastRow,
        lastCol,
        chaosChickenState,
      });

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

      console.log("🐔 TRIGGERING CHAOS CHICKEN:", player);

      const playerKey = player === "🔴" ? "player1" : "player2";
      const currentActivations = chaosChickenState.chickenActivations[playerKey];
      const willBeRooster = currentActivations === 0; // TEST MODE: Rooster of Rage activates after 1 chicken activation

      // Play appropriate sound
      if (soundManager) {
        if (willBeRooster) {
          soundManager.playSound("rooster"); // Add rooster sound to sound config
        } else {
          soundManager.playSound("chicken"); // Add chicken sound to sound config
        }
      }

      // Update activation count
      setChaosChickenState((prev) => ({
        ...prev,
        chickenActivations: {
          ...prev.chickenActivations,
          [playerKey]: prev.chickenActivations[playerKey] + 1,
        },
        ...(willBeRooster && {
          hasUsedRooster: {
            ...prev.hasUsedRooster,
            [playerKey]: true,
          },
        }),
      }));

      // Start animation
      setIsChickenAnimating(true);
      setIsRoosterMode(willBeRooster);

      if (willBeRooster) {
        // Rooster of Rage
        setChickenVoiceLine(getRandomRoosterVoiceLine());
        setTargetColumn(null);

        // Clear opponent discs after animation
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        animationTimeoutRef.current = setTimeout(() => {
          const selectedRow = selectNonEmptyRowForRooster(board);
          const { newBoard, clearedCount } = clearOpponentDiscsInRow(board, selectedRow, player);

          if (clearedCount > 0 || selectedRow !== -1) {
            // Apply gravity after clearing
            const finalBoard = applyGravityAfterClear(
              newBoard,
              isUpsideDown
            );
            onBoardUpdate(finalBoard);
          }

          setIsChickenAnimating(false);
          setChickenVoiceLine("");
          setIsRoosterMode(false);
        }, 3000);
      } else {
        // Regular chicken
        setChickenVoiceLine(getRandomChickenVoiceLine());

        // Find column to block
        const columnToBlock = getRandomUnblockedColumn(blockedColumns, board);
        if (columnToBlock !== null) {
          setTargetColumn(columnToBlock);

          // Block column after animation
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
          // No columns to block
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