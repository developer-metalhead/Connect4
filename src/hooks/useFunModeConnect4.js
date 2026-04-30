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
  isValidMoveUpsideDown,
  isBoardFullUpsideDown,
} from "../helperFunction/funModeFeatures";

export const useFunModeConnect4 = () => {
  const [gameState, setGameState] = useState(resetGame);
  const [showMonkeyButton, setShowMonkeyButton] = useState(false);
  const [monkeyButtonPlayer, setMonkeyButtonPlayer] = useState(null);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [upsideDownTurnsLeft, setUpsideDownTurnsLeft] = useState(0);
  // CHANGE: Replace usedMonkeyMayhem Set with comprehensive state object
  const [monkeyMayhemState, setMonkeyMayhemState] = useState({
    wasOffered: false, // Was the opportunity ever offered to any player
    wasUsed: false, // Was monkey mayhem actually triggered
    offeredTo: null, // Which player was offered the opportunity
    usedBy: null, // Which player actually used it (if any)
  });
  const [isMonkeyAnimating, setIsMonkeyAnimating] = useState(false);
  const [monkeyVoiceLine, setMonkeyVoiceLine] = useState("");

  const monkeyButtonTimerRef = useRef(null);

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
        monkeyMayhemState,
        showMonkeyButton,
        monkeyButtonPlayer,
      });

      // CHANGE: Use appropriate validation based on board state
      const isValidMoveCheck = isUpsideDown
        ? isValidMoveUpsideDown(board, col)
        : isValidMove(board, col);

      if (winner || isDraw || !isValidMoveCheck || isMonkeyAnimating) {
        console.log("❌ MOVE BLOCKED:", {
          reason: winner
            ? "winner exists"
            : isDraw
              ? "draw"
              : !isValidMoveCheck
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

      // CHANGE: Pass isUpsideDown parameter to checkWin
      if (checkWin(newBoard, row, col, currentPlayer, isUpsideDown)) {
        newState.winner = currentPlayer;
        console.log("🏆 WINNER DETECTED:", currentPlayer);

        // Check if it's a monkey winner
        if (isMonkeyWinner(currentPlayer, isUpsideDown)) {
          newState.isMonkeyWinner = true;
          console.log("🐒 MONKEY WINNER!", currentPlayer);
        }
      } else {
        // CHANGE: Use appropriate board full check based on board state
        const isBoardFullCheck = isUpsideDown
          ? isBoardFullUpsideDown(newBoard)
          : isBoardFull(newBoard);

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

      // CHANGE: Check for Monkey Mayhem trigger with new state management
      if (!newState.winner && !newState.isDraw && !isMonkeyAnimating) {
        console.log("🔍 CHECKING MONKEY MAYHEM TRIGGER...");

        // Only check for the player who just made the move
        if (
          shouldTriggerMonkeyMayhem(newBoard, currentPlayer, monkeyMayhemState)
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

          // CHANGE: Update monkey mayhem state to mark as offered
          setMonkeyMayhemState((prev) => ({
            ...prev,
            wasOffered: true,
            offeredTo: currentPlayer,
          }));

          // CHANGE: Set button state immediately
          setShowMonkeyButton(true);
          setMonkeyButtonPlayer(currentPlayer);

          console.log("🐒 MONKEY BUTTON STATE SET:", {
            showMonkeyButton: true,
            monkeyButtonPlayer: currentPlayer,
            monkeyMayhemState: {
              ...monkeyMayhemState,
              wasOffered: true,
              offeredTo: currentPlayer,
            },
          });

          // CHANGE: Set timer after state update - when timer expires, mark opportunity as lost
          monkeyButtonTimerRef.current = setTimeout(() => {
            console.log("⏰ MONKEY BUTTON TIMEOUT - OPPORTUNITY LOST");
            setShowMonkeyButton(false);
            setMonkeyButtonPlayer(null);
            // CHANGE: Mark opportunity as lost forever
            setMonkeyMayhemState((prev) => ({
              ...prev,
              wasOffered: true, // Keep this true so no future triggers
            }));
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
      monkeyMayhemState, // CHANGE: Updated dependency
      isMonkeyAnimating,
    ],
  );

  const triggerMonkeyMayhem = useCallback(() => {
    console.log("🐒 TRIGGER MONKEY MAYHEM CALLED:", {
      showMonkeyButton,
      monkeyButtonPlayer,
      monkeyMayhemState,
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

    // CHANGE: Mark monkey mayhem as used and by whom
    setMonkeyMayhemState((prev) => ({
      ...prev,
      wasUsed: true,
      usedBy: monkeyButtonPlayer,
    }));

    console.log("🐒 MARKED MONKEY MAYHEM AS USED:", {
      player: monkeyButtonPlayer,
      finalState: {
        ...monkeyMayhemState,
        wasUsed: true,
        usedBy: monkeyButtonPlayer,
      },
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
        // CHANGE: Pass the triggering player and board orientation to maybeStealDisc
        flippedBoard = maybeStealDisc(flippedBoard, monkeyButtonPlayer, true);

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
  }, [
    showMonkeyButton,
    monkeyButtonPlayer,
    isMonkeyAnimating,
    monkeyMayhemState,
  ]);

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
    // CHANGE: Reset monkey mayhem state to initial values
    setMonkeyMayhemState({
      wasOffered: false,
      wasUsed: false,
      offeredTo: null,
      usedBy: null,
    });

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
    monkeyMayhemState, // CHANGE: Return new state instead of usedMonkeyMayhem
  };
};
