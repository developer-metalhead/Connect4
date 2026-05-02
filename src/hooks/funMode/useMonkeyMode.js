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
  const { monkeyModeEnabled = true, onPiecePlaced, soundManager, onOverlayShow, useRotation = false } = options;

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
    if (useRotation) return isValidMove(board, col);
    const upsideDown = extensionData?.isUpsideDown || isUpsideDown;
    return upsideDown 
      ? isValidMoveUpsideDown(board, col)
      : isValidMove(board, col);
  }, [isUpsideDown, useRotation]);

  // CHANGE: Custom drop logic for upside-down mode
  const customDropLogic = useCallback((board, col, player, extensionData) => {
    if (useRotation) return dropPiece(board, col, player);
    const upsideDown = extensionData?.isUpsideDown || isUpsideDown;
    return upsideDown 
      ? dropPieceUpsideDown(board, col, player)
      : dropPiece(board, col, player);
  }, [isUpsideDown, useRotation]);

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

          // Unified restoration logic (handles both rotation and logic-flip modes)
          setTimeout(() => {
            setIsGravityFalling(true);
            
            // Use helper to calculate final logical board (pieces at bottom) and basic animations
            const { finalBoard, animations, durationMs } = returnToNormalGravity(
              newState.board,
              { isUpsideDown: true } // We treat it as upside down to calculate the fall logic
            );

            let finalAnimations = animations;

            // CHANGE: In rotation mode, pieces were logically at the bottom but visually at top.
            // When we snap back to 0deg, we want to see them fall from visual top to visual bottom.
            if (useRotation) {
              finalAnimations = [];
              newState.board.forEach((row, r) => {
                row.forEach((cell, c) => {
                  if (cell !== "⚪") {
                    finalAnimations.push({
                      col: c,
                      fromRow: -2, // Start from above the board
                      toRow: r,   // Fall to their current logical row
                      player: cell
                    });
                  }
                });
              });
            }

            setGravityAnimation(finalAnimations);
            setIsUpsideDown(false); // Snap visual board back instantly
            
            const totalDuration = useRotation ? 1500 : (durationMs + 50);

            setTimeout(() => {
              // CHANGE: CRITICAL - Update logical board to final state (pieces at bottom)
              funModeHook.updateBoard(finalBoard);
              setIsMonkeyAnimating(false);
              setMonkeyVoiceLine("");
              setGravityAnimation(null);
              setIsGravityFalling(false);
              funModeHook.updateExtensionData('isUpsideDown', false);
            }, totalDuration);
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
    updateBoard: funModeHook.updateBoard,
  };
};