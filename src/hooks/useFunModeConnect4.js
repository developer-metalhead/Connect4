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
  const [monkeyMayhemState, setMonkeyMayhemState] = useState({
    wasOffered: false,
    wasUsed: false,
    offeredTo: null,
    usedBy: null,
  });
  const [isMonkeyAnimating, setIsMonkeyAnimating] = useState(false);
  const [monkeyVoiceLine, setMonkeyVoiceLine] = useState("");
  const [isGravityFalling, setIsGravityFalling] = useState(false);

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
        isGravityFalling,
      });

      const isValidMoveCheck = isUpsideDown
        ? isValidMoveUpsideDown(board, col)
        : isValidMove(board, col);

      if (winner || isDraw || !isValidMoveCheck || isMonkeyAnimating || isGravityFalling) {
        console.log("❌ MOVE BLOCKED:", {
          reason: winner
            ? "winner exists"
            : isDraw
              ? "draw"
              : !isValidMoveCheck
                ? "invalid move"
                : isMonkeyAnimating
                  ? "monkey animating"
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

      let newState = { ...gameState, board: newBoard };

      if (checkWin(newBoard, row, col, currentPlayer, isUpsideDown)) {
        newState.winner = currentPlayer;
        console.log("🏆 WINNER DETECTED:", currentPlayer);

        if (isMonkeyWinner(currentPlayer, isUpsideDown)) {
          newState.isMonkeyWinner = true;
          console.log("🐒 MONKEY WINNER!", currentPlayer);
        }
      } else {
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

      if (isUpsideDown && upsideDownTurnsLeft > 0) {
        const newTurnsLeft = upsideDownTurnsLeft - 1;
        setUpsideDownTurnsLeft(newTurnsLeft);

        console.log("🙃 UPSIDE DOWN COUNTDOWN:", {
          turnsLeft: newTurnsLeft,
          willFlipBack: newTurnsLeft === 0,
        });

        if (newTurnsLeft === 0) {
          setTimeout(() => {
            setIsMonkeyAnimating(true);
            setMonkeyVoiceLine("Phew! Back to normal!");

            setTimeout(() => {
              setIsGravityFalling(true);
              console.log("🌊 STARTING GRAVITY FALLING ANIMATION");

              setGameState((prev) => ({
                ...prev,
                board: flipBoardUpsideDown(prev.board),
              }));
              setIsUpsideDown(false);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");

              setTimeout(() => {
                setIsGravityFalling(false);
                console.log("✅ GRAVITY FALLING ANIMATION COMPLETE - NORMAL GAMEPLAY RESUMED");
              }, 1500);

              console.log("🔄 BOARD FLIPPED BACK TO NORMAL");
            }, 2500);
          }, 500);
        }
      }

      if (!newState.winner && !newState.isDraw && !isMonkeyAnimating && !isGravityFalling) {
        console.log("🔍 CHECKING MONKEY MAYHEM TRIGGER...");

        if (
          shouldTriggerMonkeyMayhem(newBoard, currentPlayer, monkeyMayhemState)
        ) {
          console.log(
            "🎯 MONKEY MAYHEM TRIGGERED FOR CURRENT PLAYER:",
            currentPlayer,
          );

          if (monkeyButtonTimerRef.current) {
            clearTimeout(monkeyButtonTimerRef.current);
            monkeyButtonTimerRef.current = null;
            console.log("⏰ CLEARED EXISTING MONKEY BUTTON TIMER");
          }

          setMonkeyMayhemState((prev) => ({
            ...prev,
            wasOffered: true,
            offeredTo: currentPlayer,
          }));

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

          monkeyButtonTimerRef.current = setTimeout(() => {
            console.log("⏰ MONKEY BUTTON TIMEOUT - OPPORTUNITY LOST");
            setShowMonkeyButton(false);
            setMonkeyButtonPlayer(null);
            setMonkeyMayhemState((prev) => ({
              ...prev,
              wasOffered: true,
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
              : isMonkeyAnimating
                ? "monkey animating"
                : "gravity falling",
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
      monkeyMayhemState,
      isMonkeyAnimating,
      isGravityFalling,
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

    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
      console.log("⏰ CLEARED MONKEY BUTTON TIMER");
    }

    setShowMonkeyButton(false);

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

    setIsMonkeyAnimating(true);
    const voiceLine = getRandomMonkeyVoiceLine();
    setMonkeyVoiceLine(voiceLine);
    console.log("🎬 STARTING MONKEY ANIMATION:", voiceLine);

    setTimeout(() => {
      setGameState((prev) => {
        let flippedBoard = flipBoardUpsideDown(prev.board);
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
      setUpsideDownTurnsLeft(2);
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine("");

      console.log("🙃 UPSIDE DOWN MODE ACTIVATED:", {
        turnsLeft: 2,
        isUpsideDown: true,
      });
    }, 2500);
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
    setMonkeyMayhemState({
      wasOffered: false,
      wasUsed: false,
      offeredTo: null,
      usedBy: null,
    });

    setIsMonkeyAnimating(false);
    setMonkeyVoiceLine("");
    setIsGravityFalling(false);
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
    monkeyMayhemState,
    isGravityFalling,
  };
};