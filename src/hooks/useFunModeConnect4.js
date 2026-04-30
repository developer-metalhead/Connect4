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
  isMonkeyWinner,
  dropPieceUpsideDown,
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

  // CHANGE: Separate function to handle monkey mayhem trigger logic
  const checkAndTriggerMonkeyMayhem = useCallback(
    (board, player) => {
      console.log("🔍 CHECKING MONKEY MAYHEM FOR PLAYER:", player);

      if (shouldTriggerMonkeyMayhem(board, player, usedMonkeyMayhem)) {
        console.log("🎯 MONKEY MAYHEM TRIGGERED FOR PLAYER:", player);

        // Clear any existing timer
        if (monkeyButtonTimerRef.current) {
          clearTimeout(monkeyButtonTimerRef.current);
          monkeyButtonTimerRef.current = null;
        }

        setShowMonkeyButton(true);
        setMonkeyButtonPlayer(player);

        // Auto-hide button after 10 seconds
        monkeyButtonTimerRef.current = setTimeout(() => {
          console.log("⏰ MONKEY BUTTON TIMEOUT - HIDING");
          setShowMonkeyButton(false);
          setMonkeyButtonPlayer(null);
        }, 10000);

        return true;
      }

      console.log("❌ NO MONKEY MAYHEM TRIGGER FOR PLAYER:", player);
      return false;
    },
    [usedMonkeyMayhem],
  );

  const makeMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;

      console.log("🎮 MOVE START:", {
        column: col,
        currentPlayer,
        winner,
        isDraw,
        isMonkeyAnimating,
        isUpsideDown,
        upsideDownTurnsLeft,
        usedMonkeyMayhem: Array.from(usedMonkeyMayhem),
        showMonkeyButton,
        monkeyButtonPlayer,
      });

      if (winner || isDraw || !isValidMove(board, col) || isMonkeyAnimating) {
        console.log("❌ MOVE BLOCKED:", {
          reason: winner
            ? "winner exists"
            : isDraw
              ? "draw"
              : !isValidMove(board, col)
                ? "invalid move"
                : "monkey animating",
        });
        return false;
      }

      console.log(
        "📋 BOARD BEFORE MOVE:",
        board.map((row) => row.join("")),
      );

      // CHANGE: Use appropriate drop function based on board state
      const dropResult = isUpsideDown
        ? dropPieceUpsideDown(board, col, currentPlayer)
        : dropPiece(board, col, currentPlayer);

      const { newBoard, row } = dropResult;
      if (row === -1) {
        console.log("❌ COLUMN FULL:", { column: col });
        return false; // Column full
      }

      console.log(
        "📋 BOARD AFTER MOVE:",
        newBoard.map((row) => row.join("")),
      );

      let newState = { ...gameState, board: newBoard };

      // Check for win
      if (checkWin(newBoard, row, col, currentPlayer)) {
        newState.winner = currentPlayer;
        console.log("🏆 WINNER DETECTED:", currentPlayer);

        // Check if it's a monkey winner
        if (isMonkeyWinner(currentPlayer, isUpsideDown)) {
          newState.isMonkeyWinner = true;
          console.log("🐒 MONKEY WINNER!", currentPlayer);
        }
      } else if (isBoardFull(newBoard)) {
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

      setGameState(newState);

      // Handle upside-down mode turn countdown
      if (isUpsideDown && upsideDownTurnsLeft > 0) {
        const newTurnsLeft = upsideDownTurnsLeft - 1;
        setUpsideDownTurnsLeft(newTurnsLeft);

        console.log("🙃 UPSIDE DOWN COUNTDOWN:", {
          turnsLeft: newTurnsLeft,
          willFlipBack: newTurnsLeft === 0,
        });

        if (newTurnsLeft === 0) {
          // Flip back to normal
          setTimeout(() => {
            setIsMonkeyAnimating(true);
            setMonkeyVoiceLine("Phew! Back to normal!");

            setTimeout(() => {
              setGameState((prev) => ({
                ...prev,
                board: flipBoardUpsideDown(prev.board),
              }));
              setIsUpsideDown(false);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");
              console.log("🔄 BOARD FLIPPED BACK TO NORMAL");
            }, 2500);
          }, 500);
        }
      }

      // CHANGE: Check for Monkey Mayhem trigger after EVERY move for the current player only
      if (!newState.winner && !newState.isDraw && !isMonkeyAnimating) {
        console.log("🔍 CHECKING MONKEY MAYHEM TRIGGER...");

        // Only check for the player who just made the move
        if (
          shouldTriggerMonkeyMayhem(newBoard, currentPlayer, usedMonkeyMayhem)
        ) {
          console.log(
            "🎯 MONKEY MAYHEM TRIGGERED FOR CURRENT PLAYER:",
            currentPlayer,
          );

          // CHANGE: Clear any existing timer before setting new state
          if (monkeyButtonTimerRef.current) {
            clearTimeout(monkeyButtonTimerRef.current);
            monkeyButtonTimerRef.current = null;
            console.log("⏰ CLEARED EXISTING MONKEY BUTTON TIMER");
          }

          // CHANGE: Set button state immediately
          setShowMonkeyButton(true);
          setMonkeyButtonPlayer(currentPlayer);

          console.log("🐒 MONKEY BUTTON STATE SET:", {
            showMonkeyButton: true,
            monkeyButtonPlayer: currentPlayer,
          });

          // CHANGE: Set timer after state update
          monkeyButtonTimerRef.current = setTimeout(() => {
            console.log("⏰ MONKEY BUTTON TIMEOUT - HIDING");
            setShowMonkeyButton(false);
            setMonkeyButtonPlayer(null);
          }, 10000);

          console.log("⏰ MONKEY BUTTON TIMER SET FOR 10 SECONDS");
        } else {
          console.log("❌ NO MONKEY MAYHEM TRIGGER");
        }
      } else {
        console.log("🚫 MONKEY MAYHEM CHECK SKIPPED:", {
          reason: newState.winner
            ? "game won"
            : newState.isDraw
              ? "game draw"
              : "monkey animating",
        });
      }

      console.log("✅ MOVE COMPLETED:", {
        newCurrentPlayer: newState.currentPlayer,
        showMonkeyButton,
        monkeyButtonPlayer,
      });

      return true;
    },
    [
      gameState,
      isUpsideDown,
      upsideDownTurnsLeft,
      usedMonkeyMayhem,
      isMonkeyAnimating,
    ],
  );

  const triggerMonkeyMayhem = useCallback(() => {
    console.log("🐒 TRIGGER MONKEY MAYHEM CALLED:", {
      showMonkeyButton,
      monkeyButtonPlayer,
      isMonkeyAnimating,
    });

    if (!showMonkeyButton || !monkeyButtonPlayer || isMonkeyAnimating) {
      console.log("❌ MONKEY MAYHEM TRIGGER BLOCKED:", {
        showMonkeyButton,
        monkeyButtonPlayer,
        isMonkeyAnimating,
      });

      return;
    }

    // Clear the timer
    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
      console.log("⏰ CLEARED MONKEY BUTTON TIMER");
    }

    // Hide button
    setShowMonkeyButton(false);

    // Mark this player as having used Monkey Mayhem
    setUsedMonkeyMayhem((prev) => {
      const newSet = new Set([...prev, monkeyButtonPlayer]);
      console.log("🐒 MARKED PLAYER AS USED:", {
        player: monkeyButtonPlayer,
        usedPlayers: Array.from(newSet),
      });
      return newSet;
    });

    // Start animation sequence
    setIsMonkeyAnimating(true);
    const voiceLine = getRandomMonkeyVoiceLine();
    setMonkeyVoiceLine(voiceLine);
    console.log("🎬 STARTING MONKEY ANIMATION:", voiceLine);

    // After animation completes, flip the board
    setTimeout(() => {
      setGameState((prev) => {
        let flippedBoard = flipBoardUpsideDown(prev.board);
        flippedBoard = maybeStealDisc(flippedBoard); // Chance to steal a disc

        console.log("🔄 BOARD FLIPPED:", {
          before: prev.board.map((row) => row.join("")),
          after: flippedBoard.map((row) => row.join("")),
        });

        return {
          ...prev,
          board: flippedBoard,
        };
      });

      setIsUpsideDown(true);
      setUpsideDownTurnsLeft(6); // 3 turns for each player = 6 total moves
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine(""); // Clear voice line after animation

      console.log("🙃 UPSIDE DOWN MODE ACTIVATED:", {
        turnsLeft: 6,
        isUpsideDown: true,
      });
    }, 2500); // Animation duration
  }, [showMonkeyButton, monkeyButtonPlayer, isMonkeyAnimating]);

  const reset = useCallback(() => {
    console.log("🔄 RESETTING GAME");

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
    usedMonkeyMayhem,
  };
};
