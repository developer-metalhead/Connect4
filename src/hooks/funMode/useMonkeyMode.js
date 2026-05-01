import { useState, useCallback, useRef } from "react";
import { useFunMode } from "./useFunMode";
import {
  shouldTriggerMonkeyMayhem,
  flipBoardUpsideDown,
  maybeStealDisc,
  getRandomMonkeyVoiceLine,
  isMonkeyWinner,
  dropPieceUpsideDown,
  isValidMoveUpsideDown,
  isBoardFullUpsideDown,
  returnToNormalGravity,
  
} from "../../helperFunction/funMode/monkeyModeFeatures";
import { isValidMove,dropPiece } from "../../helperFunction/helperFunction";

// CHANGE: Unified monkey mode hook (no more separate "mayhem" terminology)
export const useMonkeyMode = (options = {}) => {
  const { monkeyModeEnabled = true } = options;

  // CHANGE: Monkey-specific state (consolidated from previous separate hooks)
  const [showMonkeyButton, setShowMonkeyButton] = useState(false);
  const [monkeyButtonPlayer, setMonkeyButtonPlayer] = useState(null);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [upsideDownTurnsLeft, setUpsideDownTurnsLeft] = useState(0);
  const [monkeyState, setMonkeyState] = useState({
    wasOffered: false,
    wasUsed: false,
    offeredTo: null,
    usedBy: null,
  });
  const [isMonkeyAnimating, setIsMonkeyAnimating] = useState(false);
  const [monkeyVoiceLine, setMonkeyVoiceLine] = useState("");
  const [isGravityFalling, setIsGravityFalling] = useState(false);
  const [gravityAnimation, setGravityAnimation] = useState(null);

  const monkeyButtonTimerRef = useRef(null);

  // CHANGE: Custom validation for upside-down mode
  const customValidation = useCallback((board, col, extensionData) => {
    const upsideDown = extensionData?.isUpsideDown || isUpsideDown;
    return upsideDown 
      ? isValidMoveUpsideDown(board, col)
      : isValidMove(board, col);
  }, [isUpsideDown]);

  // CHANGE: Custom drop logic for upside-down mode
  const customDropLogic = useCallback((board, col, player, extensionData) => {
    const upsideDown = extensionData?.isUpsideDown || isUpsideDown;
    return upsideDown 
      ? dropPieceUpsideDown(board, col, player)
      : dropPiece(board, col, player);
  }, [isUpsideDown]);

  // CHANGE: Handle move completion for monkey triggers
  const handleMoveComplete = useCallback((newState, moveData, extensionData) => {
    if (!monkeyModeEnabled || newState.winner || newState.isDraw || isMonkeyAnimating || isGravityFalling) {
      return;
    }

    // Handle upside-down turn countdown
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
            console.log("🌊 STARTING GRAVITY RESTORE ANIMATION");

            const { finalBoard, animations, durationMs } = returnToNormalGravity(
              newState.board,
              { isUpsideDown: true }
            );

            setGravityAnimation(animations);

            setTimeout(() => {
              funModeHook.updateBoard(finalBoard);
              setIsUpsideDown(false);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");
              setGravityAnimation(null);
              setIsGravityFalling(false);
              funModeHook.updateExtensionData('isUpsideDown', false);
              console.log("✅ GRAVITY RESTORE COMPLETE");
            }, durationMs + 50);
          }, 2500);
        }, 500);
      }
    }

    // CHANGE: Check for monkey trigger (unified logic)
    if (shouldTriggerMonkeyMayhem(newState.board, moveData.player, monkeyState)) {
      console.log("🎯 MONKEY MODE TRIGGERED FOR:", moveData.player);

      if (monkeyButtonTimerRef.current) {
        clearTimeout(monkeyButtonTimerRef.current);
        monkeyButtonTimerRef.current = null;
      }

      setMonkeyState(prev => ({
        ...prev,
        wasOffered: true,
        offeredTo: moveData.player,
      }));

      setShowMonkeyButton(true);
      setMonkeyButtonPlayer(moveData.player);

      monkeyButtonTimerRef.current = setTimeout(() => {
        console.log("⏰ MONKEY BUTTON TIMEOUT");
        setShowMonkeyButton(false);
        setMonkeyButtonPlayer(null);
      }, 10000);
    }
  }, [
    monkeyModeEnabled,
    isUpsideDown,
    upsideDownTurnsLeft,
    monkeyState,
    isMonkeyAnimating,
    isGravityFalling
  ]);

  // CHANGE: Handle game end for monkey winner detection
  const handleGameEnd = useCallback((newState, endType, extensionData) => {
    if (endType === 'win' && (extensionData?.isUpsideDown || isUpsideDown)) {
      newState.isMonkeyWinner = true;
      console.log("🐒 MONKEY WINNER!", newState.winner);
    }
  }, [isUpsideDown]);

  // CHANGE: Initialize core fun mode with monkey extensions
  const funModeHook = useFunMode({
    enableExtensions: monkeyModeEnabled,
    customValidation,
    customDropLogic,
    onMoveComplete: handleMoveComplete,
    onGameEnd: handleGameEnd,
  });

  // CHANGE: Trigger monkey mode (unified from previous "mayhem" function)
  const triggerMonkeyMode = useCallback(() => {
    if (!monkeyModeEnabled || !showMonkeyButton || !monkeyButtonPlayer || isMonkeyAnimating) {
      console.log("❌ MONKEY MODE TRIGGER BLOCKED");
      return;
    }

    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
    }

    setShowMonkeyButton(false);
    setMonkeyState(prev => ({
      ...prev,
      wasUsed: true,
      usedBy: monkeyButtonPlayer,
    }));

    setIsMonkeyAnimating(true);
    const voiceLine = getRandomMonkeyVoiceLine();
    setMonkeyVoiceLine(voiceLine);
    console.log("🎬 STARTING MONKEY ANIMATION:", voiceLine);

    setTimeout(() => {
      let flippedBoard = flipBoardUpsideDown(funModeHook.gameState.board);
      flippedBoard = maybeStealDisc(flippedBoard, monkeyButtonPlayer, true);

      funModeHook.updateBoard(flippedBoard);
      setIsUpsideDown(true);
      setUpsideDownTurnsLeft(4);
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine("");
      funModeHook.updateExtensionData('isUpsideDown', true);

      console.log("🙃 UPSIDE DOWN MODE ACTIVATED");
    }, 2500);
  }, [
    monkeyModeEnabled,
    showMonkeyButton,
    monkeyButtonPlayer,
    isMonkeyAnimating,
    funModeHook
  ]);

  // CHANGE: Enhanced reset that includes monkey state
  const reset = useCallback(() => {
    console.log("🔄 RESETTING MONKEY MODE");

    if (monkeyButtonTimerRef.current) {
      clearTimeout(monkeyButtonTimerRef.current);
      monkeyButtonTimerRef.current = null;
    }

    funModeHook.reset();
    setShowMonkeyButton(false);
    setMonkeyButtonPlayer(null);
    setIsUpsideDown(false);
    setUpsideDownTurnsLeft(0);
    setMonkeyState({
      wasOffered: false,
      wasUsed: false,
      offeredTo: null,
      usedBy: null,
    });
    setIsMonkeyAnimating(false);
    setMonkeyVoiceLine("");
    setIsGravityFalling(false);
    setGravityAnimation(null);
  }, [funModeHook]);

  return {
    // Core game state and actions from fun mode
    gameState: funModeHook.gameState,
    makeMove: funModeHook.makeMove,
    reset,

    // Monkey-specific state
    showMonkeyButton,
    monkeyButtonPlayer,
    isUpsideDown,
    upsideDownTurnsLeft,
    monkeyMayhemState: monkeyState, // CHANGE: Keep this name for backward compatibility
    isMonkeyAnimating,
    monkeyVoiceLine,
    isGravityFalling,
    gravityAnimation,

    // Monkey actions
    triggerMonkeyMayhem: triggerMonkeyMode, // CHANGE: Keep this name for backward compatibility
  };
};