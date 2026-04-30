import { useState, useCallback, useRef } from "react";
import {
  shouldTriggerMonkeyMayhem,
  flipBoardUpsideDown,
  maybeStealDisc,
  getRandomMonkeyVoiceLine,
  returnToNormalGravity
} from "../../helperFunction/funMode/monkeyModeFeatures";

export const useMonkeyMode = (options = {}) => {
  const { monkeyModeEnabled = true } = options;
  
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

  const monkeyButtonTimerRef = useRef(null);

  // CHANGE: Handle upside-down countdown logic
  const handleUpsideDownCountdown = useCallback((newState, setIsGravityFalling, setGravityAnimation) => {
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
            // CHANGE: Use the gravity restore function from core hook
            setIsGravityFalling(true);
            console.log("🌊 STARTING GRAVITY RESTORE (mass falling) ANIMATION");

            const { finalBoard, animations, durationMs } = returnToNormalGravity(
              newState.board,
              { isUpsideDown: true },
            );

            setGravityAnimation(animations);

            setTimeout(() => {
              setIsUpsideDown(false);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");
              setGravityAnimation(null);
              setIsGravityFalling(false);
              console.log("✅ GRAVITY RESTORE COMPLETE - NORMAL GAMEPLAY RESUMED");
            }, durationMs + 50);

            console.log("🔄 BOARD FLIPPED BACK TO NORMAL");
          }, 2500);
        }, 500);
      }
    }
  }, [isUpsideDown, upsideDownTurnsLeft]);

  // CHANGE: Handle monkey mayhem trigger logic
  const handleMonkeyMayhemTrigger = useCallback((board, currentPlayer) => {
    console.log("🔍 CHECKING MONKEY MAYHEM TRIGGER...");

    if (
      monkeyModeEnabled &&
      shouldTriggerMonkeyMayhem(board, currentPlayer, monkeyMayhemState)
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
  }, [monkeyModeEnabled, monkeyMayhemState]);

  const triggerMonkeyMayhem = useCallback((updateGameState) => {
    if (!monkeyModeEnabled) {
      console.log("❌ MONKEY MAYHEM DISABLED IN SETTINGS");
      return;
    }
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
      // CHANGE: Use callback to update game state from core hook
      updateGameState((prev) => {
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
      setUpsideDownTurnsLeft(4);
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine("");

      console.log("🙃 UPSIDE DOWN MODE ACTIVATED:", {
        turnsLeft: 4,
        isUpsideDown: true,
      });
    }, 2500);
  }, [
    showMonkeyButton,
    monkeyButtonPlayer,
    isMonkeyAnimating,
    monkeyMayhemState,
    monkeyModeEnabled,
  ]);

  const reset = useCallback(() => {
    console.log("🔄 RESETTING MONKEY MODE");

    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
    }

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
  }, []);

  return {
    // State
    showMonkeyButton,
    monkeyButtonPlayer,
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    monkeyVoiceLine,
    monkeyMayhemState,
    
    // Actions
    triggerMonkeyMayhem,
    reset,
    
    // CHANGE: Expose handler functions for core hook to use
    handleUpsideDownCountdown,
    handleMonkeyMayhemTrigger,
  };
};