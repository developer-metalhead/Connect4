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
    wasOffered: false,
    wasUsed: false,
    offeredTo: null,
    usedBy: null,
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
            
            // Calculate final logical board and animations
            // If board is 180deg, normal gravity means falling to Row 0
            const currentBoard = newState.board;
            const targetLogicUpsideDown = isUpsideDown; // If board is 180deg, normal gravity = Row 0
            
            const fallAnimations = [];
            
            // If board is 180deg, normal gravity (screen bottom) is Row 0.
            // During monkey mode, gravity was inverted (screen top = Row 5).
            // So pieces fall from 5 -> 0.
            currentBoard.forEach((row, r) => {
              row.forEach((cell, c) => {
                if (cell !== "⚪") {
                  fallAnimations.push({
                    col: c,
                    fromRow: r,      // Start from where they are (Row 5 range)
                    toRow: isUpsideDown ? 0 : 5, // Fall to visual bottom
                    player: cell
                  });
                }
              });
            });

            // We need a more realistic final board calculation
            const normalizedBoard = isUpsideDown ? flipBoardUpsideDown(currentBoard) : applyNormalGravity(currentBoard);
            
            // Recalculate animations based on the actual target rows in normalizedBoard
            const finalAnimations = [];
            normalizedBoard.forEach((row, r) => {
              row.forEach((cell, c) => {
                if (cell !== "⚪") {
                  // Find where this piece was in the currentBoard (column-wise)
                  // For simplicity in a single turn restoration, we can just map them
                  // but returnToNormalGravity already does this logic.
                }
              });
            });

            // Let's use the helper but pass the correct target orientation
            const { finalBoard, animations, durationMs } = returnToNormalGravity(
              currentBoard,
              { 
                isUpsideDown: true, 
                isVisualRotation: isUpsideDown 
              }
            );

            setGravityAnimation(animations);
            setGravity("normal");
            
            // CHANGE: Hide monkey overlay as soon as gravity restore begins so discs are visible
            setIsMonkeyAnimating(false);
            setMonkeyVoiceLine("");

            setTimeout(() => {
              funModeHook.updateBoard(finalBoard);
              setGravityAnimation(null);
              setIsGravityFalling(false);
              funModeHook.updateExtensionData('isUpsideDown', isUpsideDown);
              funModeHook.updateExtensionData('isLogicUpsideDown', isUpsideDown); // normal gravity in 180deg
            }, Math.max(durationMs, 1200));
          }, 2500);
        }, 500);
      }
    }

    // CHANGE: Check for monkey trigger (unified logic)
    if (shouldTriggerMonkeyMayhem(newState.board, moveData.player, monkeyState)) {
      console.log("🎯 MONKEY MODE TRIGGERED FOR:", moveData.player);
      
      // CHANGE: Play monkey laugh immediately on trigger
      soundManager?.playSound("monkeylaugh");

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
    onPiecePlaced,
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
    
    // Play monkey laugh sound
    soundManager?.playSound('monkeylaugh');

    setTimeout(() => {
      // CHANGE: Stop the laugh sound immediately when the board flips
      soundManager?.stopSound('monkeylaugh');

      let currentBoard = funModeHook.gameState.board;
      let flippedBoard = useRotation ? currentBoard : flipBoardUpsideDown(currentBoard);
      
      const { newBoard: afterStealBoard, stolenCell, opponentPlayer } = maybeStealDisc(flippedBoard, monkeyButtonPlayer, !useRotation);
      flippedBoard = afterStealBoard;

      // === MONKEY MAYHEM OVERLAY ===
      if (stolenCell && onOverlayShow) {
        // === AUDIO: Play coinfalling.mp3 when discs are removed ===
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
      setIsUpsideDown(true);
      setGravity("inverted"); // Gravity pulls to visual top
      setUpsideDownTurnsLeft(4);
      setIsMonkeyAnimating(false);
      setMonkeyButtonPlayer(null);
      setMonkeyVoiceLine("");
      funModeHook.updateExtensionData('isUpsideDown', true);
      funModeHook.updateExtensionData('isLogicUpsideDown', false); // 180deg + inverted = Row 5 (visual top)

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