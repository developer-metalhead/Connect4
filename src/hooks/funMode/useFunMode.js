import { useState, useCallback, useRef } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
} from "../../helperFunction/helperFunction";
import {
  dropPieceUpsideDown,
  isValidMoveUpsideDown,
  isBoardFullUpsideDown,
  returnToNormalGravity,
  isMonkeyWinner,
} from "../../helperFunction/funMode/monkeyModeFeatures";

export const useFunMode = (options = {}) => {
  const { 
    monkeyModeHook = null, 
    chaosChickenHook = null 
  } = options;
  
  const [gameState, setGameState] = useState(resetGame);
  const [isGravityFalling, setIsGravityFalling] = useState(false);
  const [gravityAnimation, setGravityAnimation] = useState(null);

  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      console.log("🎮 FUNMODE MOVE START:", {
        column: col,
        currentPlayer,
        winner,
        isDraw,
        isGravityFalling,
      });

      // Get upside-down state from monkey mode hook if available
      const isUpsideDown = monkeyModeHook?.isUpsideDown || false;
      const isMonkeyAnimating = monkeyModeHook?.isMonkeyAnimating || false;
      const isChickenAnimating = chaosChickenHook?.isChickenAnimating || false;

      const isValidMoveCheck = isUpsideDown
        ? isValidMoveUpsideDown(board, col)
        : isValidMove(board, col);

      if (winner || isDraw || !isValidMoveCheck || isMonkeyAnimating || isChickenAnimating || isGravityFalling) {
        console.log("❌ FUNMODE MOVE BLOCKED:", {
          reason: winner
            ? "winner exists"
            : isDraw
              ? "draw"
              : !isValidMoveCheck
                ? "invalid move"
                : isMonkeyAnimating
                  ? "monkey animating"
                  : isChickenAnimating
                    ? "chicken animating"
                    : "gravity falling",
        });
        return false;
      }

      console.log(
        "📋 BOARD BEFORE MOVE:",
        board.map((row) => row.join("")),
      );

      const dropResult = isUpsideDown
        ? dropPieceUpsideDown(board, col, currentPlayer)
        : dropPiece(board, col, currentPlayer);

      const { newBoard, row } = dropResult;
      if (row === -1) {
        console.log("❌ COLUMN FULL:", { column: col });
        return false;
      }

      console.log(
        "📋 BOARD AFTER MOVE:",
        newBoard.map((row) => row.join("")),
      );

      // CHANGE: Check for Chaos Chicken IMMEDIATELY after board update, before any turn changes
      let chaosChickenTriggered = false;
      let chaosChickenResult = { newBoard, blockedColumns: chaosChickenHook?.blockedColumns || [] };

      
      if (chaosChickenHook && chaosChickenHook.checkChaosChickenTrigger) {
        console.log("🐔 CHECKING CHAOS CHICKEN FOR PLAYER WHO JUST MOVED:", currentPlayer);
        
        if (chaosChickenHook.checkChaosChickenTrigger(newBoard, currentPlayer)) {
          console.log("🐔 CHAOS CHICKEN TRIGGERED IMMEDIATELY FOR:", currentPlayer);
          chaosChickenTriggered = true;
          
          // CHANGE: Trigger chaos chicken with the board that includes the just-placed piece
          // This will update the chaos chicken hook's internal state including blocked columns
          chaosChickenResult = chaosChickenHook.triggerChaosChicken(newBoard, currentPlayer);
          
          // CHANGE: End chicken turn (decrease blocked column timers) - this affects all players

        }
      }

      // CHANGE: Use the potentially modified board from chaos chicken
      const finalBoard = chaosChickenResult.newBoard;
      let newState = { ...gameState, board: finalBoard };

      if (checkWin(finalBoard, row, col, currentPlayer, isUpsideDown)) {
        newState.winner = currentPlayer;
        console.log("🏆 WINNER DETECTED:", currentPlayer);

        if (isMonkeyWinner(currentPlayer, isUpsideDown)) {
          newState.isMonkeyWinner = true;
          console.log("🐒 MONKEY WINNER!", currentPlayer);
        }
      } else {
        const isBoardFullCheck = isUpsideDown
          ? isBoardFullUpsideDown(finalBoard)
          : isBoardFull(finalBoard);

        if (isBoardFullCheck) {
          newState.isDraw = true;
          console.log("🤝 DRAW DETECTED");
        } else {
          newState.currentPlayer = getNextPlayer(currentPlayer);
          console.log(
            "🔄 TURN CHANGE:",
            currentPlayer,
            "→",
            newState.currentPlayer,
          );
        }
      }

      setGameState(newState);

      // CHANGE: Handle upside-down countdown through monkey mode hook
      if (monkeyModeHook && monkeyModeHook.handleUpsideDownCountdown) {
        monkeyModeHook.handleUpsideDownCountdown(newState, setIsGravityFalling, setGravityAnimation);
      }

      // CHANGE: Handle monkey mayhem trigger through monkey mode hook
      if (monkeyModeHook && monkeyModeHook.handleMonkeyMayhemTrigger && !newState.winner && !newState.isDraw && !isMonkeyAnimating && !isChickenAnimating && !isGravityFalling) {
        monkeyModeHook.handleMonkeyMayhemTrigger(finalBoard, currentPlayer);
      }

      console.log("✅ FUNMODE MOVE COMPLETED:", {
        newCurrentPlayer: newState.currentPlayer,
        chaosChickenTriggered,
      });

      return true;
    },
    [
      gameState,
      isGravityFalling,
      monkeyModeHook,
      chaosChickenHook,
    ],
  );

  const reset = useCallback(() => {
    console.log("🔄 FUNMODE RESETTING GAME");

    setGameState(resetGame());
    setIsGravityFalling(false);
    setGravityAnimation(null);

    // CHANGE: Reset monkey mode hook if available
    if (monkeyModeHook && monkeyModeHook.reset) {
      monkeyModeHook.reset();
    }

    // CHANGE: Reset chaos chicken hook if available
    if (chaosChickenHook && chaosChickenHook.reset) {
      chaosChickenHook.reset();
    }
  }, [monkeyModeHook, chaosChickenHook]);

  // CHANGE: Handle gravity restoration
  const handleGravityRestore = useCallback((currentBoard) => {
    setIsGravityFalling(true);
    console.log("🌊 STARTING GRAVITY RESTORE (mass falling) ANIMATION");

    const { finalBoard, animations, durationMs } = returnToNormalGravity(
      currentBoard,
      { isUpsideDown: true },
    );

    setGravityAnimation(animations);

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        board: finalBoard,
      }));
      setGravityAnimation(null);
      setIsGravityFalling(false);
      console.log("✅ GRAVITY RESTORE COMPLETE - NORMAL GAMEPLAY RESUMED");
    }, durationMs + 50);

    return finalBoard;
  }, []);

  return {
    gameState,
    makeMove,
    reset,
    isGravityFalling,
    gravityAnimation,
    handleGravityRestore,
  };
};