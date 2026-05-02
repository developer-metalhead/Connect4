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
  applyNormalGravity,
  applyInvertedGravity,
  planInvertedGravityAnimation,
} from "../../helperFunction/funMode/monkeyModeFeatures";
import { MONKEY_CONFIG } from "../../logic/funMode/funMode";
import { isValidMove,dropPiece } from "../../helperFunction/helperFunction";

// CHANGE: Unified monkey mode hook (no more separate "mayhem" terminology)
// Manages visual orientation, logical gravity, and monkey-themed game events.
export const useMonkeyMode = (options = {}) => {
  const { monkeyModeEnabled = true, onPiecePlaced, soundManager, onOverlayShow, useRotation = false } = options;

  // CHANGE: Monkey-specific state (consolidated from previous separate hooks)
  const [showMonkeyButton, setShowMonkeyButton] = useState(false);
  const [monkeyButtonPlayer, setMonkeyButtonPlayer] = useState(null);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [gravity, setGravity] = useState("normal");
  const [upsideDownTurnsLeft, setUpsideDownTurnsLeft] = useState(0);
  const [monkeyState, setMonkeyState] = useState({
    totalActivations: 0,
    lastOfferedTo: null,
    lastUsedBy: null,
  });
  const [isMonkeyAnimating, setIsMonkeyAnimating] = useState(false);
  const [monkeyVoiceLine, setMonkeyVoiceLine] = useState("");
  const [isGravityFalling, setIsGravityFalling] = useState(false);
  const [gravityAnimation, setGravityAnimation] = useState(null);

  // CHANGE: Compute logical gravity state (true if pulling towards Row 0)
  const isLogicUpsideDown = isUpsideDown ? (gravity === "normal") : (gravity === "inverted");

  const monkeyButtonTimerRef = useRef(null);

  // CHANGE: Custom drop and validation logic now respect decoupled gravity
  const customValidation = useCallback((board, col, extensionData) => {
    const logicalUpsideDown = extensionData?.isLogicUpsideDown || isLogicUpsideDown;
    return logicalUpsideDown 
      ? isValidMoveUpsideDown(board, col)
      : isValidMove(board, col);
  }, [isLogicUpsideDown]);

  const customDropLogic = useCallback((board, col, player, extensionData) => {
    const logicalUpsideDown = extensionData?.isLogicUpsideDown || isLogicUpsideDown;
    return logicalUpsideDown 
      ? dropPieceUpsideDown(board, col, player)
      : dropPiece(board, col, player);
  }, [isLogicUpsideDown]);

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
          setMonkeyVoiceLine("Phew! Gravity is back!");

          // CHANGE: Unified restoration logic - DO NOT FLIP, just restore gravity
          setTimeout(() => {
            setIsGravityFalling(true);
            
            const currentBoard = newState.board;

            // Use the helper for the animation plan (visual fall while wrapper still at 180deg)
            const { animations, durationMs } = returnToNormalGravity(
              currentBoard,
              { 
                isUpsideDown: true, 
                isVisualRotation: isUpsideDown // drives which animation plan to use
              }
            );
            
            // CHANGE: Always commit applyNormalGravity as final board.
            const finalBoard = applyNormalGravity(currentBoard);

            setGravityAnimation(animations);
            setGravity("normal");
            
            setIsMonkeyAnimating(false);
            setMonkeyVoiceLine("");

            setTimeout(() => {
              funModeHook.updateBoard(finalBoard);
              setGravityAnimation(null);
              setIsGravityFalling(false);
              setIsUpsideDown(false);
              setGravity("normal");
              funModeHook.updateExtensionData('isUpsideDown', false);
              funModeHook.updateExtensionData('isLogicUpsideDown', false);
            }, Math.max(durationMs, 1200));
          }, 2500);
        }, 500);
      }
    }

    // CHANGE: Check for monkey trigger (Allow multiple activations)
    if (shouldTriggerMonkeyMayhem(newState.board, moveData.player, monkeyState)) {
      console.log("🎯 MONKEY MODE OFFERED TO:", moveData.player);
      
      soundManager?.playSound("monkeylaugh");

      if (monkeyButtonTimerRef.current) {
        clearTimeout(monkeyButtonTimerRef.current);
        monkeyButtonTimerRef.current = null;
      }

      setMonkeyState(prev => ({
        ...prev,
        lastOfferedTo: moveData.player,
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
    onPiecePlaced,
  });

  // CHANGE: Trigger monkey mode (Supports Stacking and Multiple activations)
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
      totalActivations: prev.totalActivations + 1,
      lastUsedBy: monkeyButtonPlayer,
    }));

    setIsMonkeyAnimating(true);
    const voiceLine = getRandomMonkeyVoiceLine();
    setMonkeyVoiceLine(voiceLine);
    console.log("🎬 STARTING MONKEY ANIMATION:", voiceLine);
    
    soundManager?.playSound('monkeylaugh');

    setTimeout(() => {
      soundManager?.stopSound('monkeylaugh');

      let currentBoard = funModeHook.gameState.board;
      
      // If already upside down, we "flip back" visually but maybe keep inverted gravity logic?
      // Actually, user said "flip again", so we toggle states.
      const newIsUpsideDown = !isUpsideDown;
      const newGravity = gravity === "normal" ? "inverted" : "normal";
      
      let flippedBoard = useRotation ? currentBoard : flipBoardUpsideDown(currentBoard);
      
      const { newBoard: afterStealBoard, stolenCell, opponentPlayer } = maybeStealDisc(flippedBoard, monkeyButtonPlayer, !useRotation);
      flippedBoard = afterStealBoard;

      if (stolenCell && onOverlayShow) {
        soundManager?.playSound('coinsfalling');
        onOverlayShow({
          type: "monkey",
          count: 1,
          row: stolenCell.row,
          col: stolenCell.col,
          player: opponentPlayer
        });
      }

      funModeHook.updateBoard(flippedBoard);
      setIsUpsideDown(newIsUpsideDown);
      setGravity(newGravity); 
      setUpsideDownTurnsLeft(MONKEY_CONFIG.MAYHEM_DURATION);
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine("");
      
      // Update extension data for game logic sync
      funModeHook.updateExtensionData('isUpsideDown', newIsUpsideDown);
      // Re-calculate logical gravity for the engine
      const newLogicUpsideDown = newIsUpsideDown ? (newGravity === "normal") : (newGravity === "inverted");
      funModeHook.updateExtensionData('isLogicUpsideDown', newLogicUpsideDown);

      console.log("🙃 MONKEY MAYHEM STACKED/ACTIVATED", { newIsUpsideDown, newGravity, newLogicUpsideDown });
    }, 2500);
  }, [
    monkeyModeEnabled,
    showMonkeyButton,
    monkeyButtonPlayer,
    isMonkeyAnimating,
    funModeHook,
    isUpsideDown,
    gravity
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
    setGravity("normal");
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
    gravity,
    upsideDownTurnsLeft,
    monkeyMayhemState: monkeyState, // CHANGE: Keep this name for backward compatibility
    isMonkeyAnimating,
    monkeyVoiceLine,
    isGravityFalling,
    gravityAnimation,

    // Monkey actions
    triggerMonkeyMayhem: triggerMonkeyMode, // CHANGE: Keep this name for backward compatibility
    updateBoard: funModeHook.updateBoard,
  };
};