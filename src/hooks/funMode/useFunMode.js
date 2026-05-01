import { useState, useCallback } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
} from "../../helperFunction/helperFunction";

// CHANGE: Core fun mode hook - generic base for all fun mode features
export const useFunMode = (options = {}) => {
  const { 
    enableExtensions = true,
    customValidation = null,
    customDropLogic = null,
    onMoveComplete = null,
    onGameEnd = null 
  } = options;

  const [gameState, setGameState] = useState(resetGame);
  const [isAnimating, setIsAnimating] = useState(false);
  const [extensionData, setExtensionData] = useState({});

  // CHANGE: Core game move logic with extension points
  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      console.log("🎮 CORE FUN MODE MOVE:", {
        column: col,
        currentPlayer,
        winner,
        isDraw,
        isAnimating,
      });

      // CHANGE: Use custom validation if provided by extensions
      const isValidMoveCheck = customValidation 
        ? customValidation(board, col, extensionData)
        : isValidMove(board, col);

      if (winner || isDraw || !isValidMoveCheck || isAnimating) {
        console.log("❌ CORE MOVE BLOCKED:", {
          reason: winner
            ? "winner exists"
            : isDraw
              ? "draw"
              : !isValidMoveCheck
                ? "invalid move"
                : "animating",
        });
        return false;
      }

      console.log("📋 BOARD BEFORE MOVE:", board.map((row) => row.join("")));

      // CHANGE: Use custom drop logic if provided by extensions
      const dropResult = customDropLogic 
        ? customDropLogic(board, col, currentPlayer, extensionData)
        : dropPiece(board, col, currentPlayer);

      const { newBoard, row } = dropResult;
      if (row === -1) {
        console.log("❌ COLUMN FULL:", { column: col });
        return false;
      }

      console.log("📋 BOARD AFTER MOVE:", newBoard.map((row) => row.join("")));

      // Evaluate immediate piece placement extensions synchronously
      if (options.onPiecePlaced) {
        // Run any immediate triggers (like Chaos Chicken 2x2 detection) before turn switch
        options.onPiecePlaced(newBoard, row, col, currentPlayer);
      }

      let newState = { ...gameState, board: newBoard };

      // CHANGE: Check win condition with extension data
      if (checkWin(newBoard, row, col, currentPlayer)) {
        newState.winner = currentPlayer;
        console.log("🏆 WINNER DETECTED:", currentPlayer);
        
        if (onGameEnd && enableExtensions) {
          onGameEnd(newState, 'win', extensionData);
        }
      } else if (isBoardFull(newBoard)) {
        newState.isDraw = true;
        console.log("🤝 DRAW DETECTED");
        
        if (onGameEnd && enableExtensions) {
          onGameEnd(newState, 'draw', extensionData);
        }
      } else {
        newState.currentPlayer = getNextPlayer(currentPlayer);
        console.log("🔄 TURN CHANGE:", currentPlayer, "→", newState.currentPlayer);
      }

      setGameState(newState);

      // CHANGE: Notify extensions of move completion
      if (onMoveComplete && enableExtensions) {
        onMoveComplete(newState, { col, row, player: currentPlayer }, extensionData);
      }

      console.log("✅ CORE FUN MODE MOVE COMPLETED");
      return true;
    },
    [gameState, isAnimating, enableExtensions, customValidation, customDropLogic, onMoveComplete, onGameEnd, extensionData]
  );

  // CHANGE: Animation management for extensions
  const startAnimation = useCallback((animationKey, duration = 2500) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, []);

  // CHANGE: Generic extension data management
  const updateExtensionData = useCallback((key, value) => {
    setExtensionData(prev => ({ ...prev, [key]: value }));
  }, []);

  const getExtensionData = useCallback((key) => {
    return extensionData[key];
  }, [extensionData]);

  // CHANGE: Board state modification for extensions
  const updateBoard = useCallback((newBoard) => {
    setGameState(prev => ({ ...prev, board: newBoard }));
  }, []);

  // CHANGE: Game reset with extension cleanup
  const reset = useCallback(() => {
    console.log("🔄 RESETTING CORE FUN MODE");
    setGameState(resetGame());
    setIsAnimating(false);
    setExtensionData({});
  }, []);

  return {
    // Core game state
    gameState,
    isAnimating,
    
    // Core actions
    makeMove,
    reset,
    
    // Extension helpers
    updateBoard,
    setGameState,
    startAnimation,
    updateExtensionData,
    getExtensionData,
    extensionData,
  };
};