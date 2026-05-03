import { useCallback, useEffect, useRef, useState } from "react";
import { 
  isValidMove, 
  calculateDropDuration, 
  getTargetRow 
} from "../../logic/core/engine";
import { CORE_CONFIG, ANIMATION_CONFIG, PLAYERS, EVENTS } from "../../logic/core/coreConfig";
import { gameBus } from "../../logic/core/eventBus";
import { pickCpuMoveSmart, getBoardKey } from "../../logic/cpu/cpuEngine";
import { updateMemoryOnGameEnd } from "../../logic/cpu/cpuMemory";
import { createInitialState, processMove } from "../../logic/core/gameEngine";

const HUMAN = PLAYERS.P1;
const CPU = PLAYERS.P2;

/**
 * Hook for standard VS CPU Connect 4 game.
 * Decoupled from game-mode switching.
 */
export const useConnect4CPU = (difficulty = "Expert") => {
  const [gameState, setGameState] = useState(createInitialState);
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [cpuPreviewCol, setCpuPreviewCol] = useState(null);
  const [isCpuDropping, setIsCpuDropping] = useState(false);
  const [cpuDroppingCol, setCpuDroppingCol] = useState(null);
  const [shouldShowPostVideoOverlay, setShouldShowPostVideoOverlay] = useState(false);
  
  const aiTimerRef = useRef(null);
  const historyRef = useRef([]);

  const makeHumanMove = useCallback((col) => {
    if (gameState.winner || gameState.isDraw || gameState.currentPlayer !== HUMAN || isCpuThinking) return false;
    if (!isValidMove(gameState.board, col)) return false;
    
    setGameState(prev => {
      const next = processMove(prev, col);
      return next.moveValid ? next : prev;
    });
    return true;
  }, [gameState, isCpuThinking]);

  useEffect(() => {
    const { board, currentPlayer, winner, isDraw } = gameState;
    if (winner || isDraw || currentPlayer !== CPU) return;

    aiTimerRef.current = setTimeout(() => {
      // ENGINE: Standard column-based move
      const move = pickCpuMoveSmart(board, difficulty, { winLength: CORE_CONFIG.MODE.WIN_PATTERN.length, gravity: true });
      if (!move) { setGameState(prev => ({ ...prev, isDraw: true })); return; }
      
      const col = typeof move === 'object' ? move.col : move;

      // EMIT: CPU Thinking Start
      gameBus.emit(EVENTS.CPU_THINKING_START, { col });
      setIsCpuThinking(true);
      setCpuPreviewCol(col);

      setTimeout(() => {
        historyRef.current.push({ key: getBoardKey(board, CPU), col, player: CPU });
        
        // EMIT: CPU Move Decided & UI Lock
        gameBus.emit(EVENTS.CPU_MOVE_DECIDED, { col });
        gameBus.emit(EVENTS.UI_LOCK);
        
        setIsCpuThinking(false);
        setCpuPreviewCol(null);
        setIsCpuDropping(true);
        setCpuDroppingCol(col);

        const targetRow = getTargetRow(board, col);
        const animationDuration = calculateDropDuration(board.length - targetRow);

        setTimeout(() => {
          setGameState(prev => {
            const next = processMove(prev, col);
            return next.moveValid ? next : prev;
          });
          setIsCpuDropping(false);
          setCpuDroppingCol(null);
          
          // EMIT: UI Unlock
          gameBus.emit(EVENTS.UI_UNLOCK);
        }, animationDuration + 100); // 100ms post-drop buffer
      }, 500); // 500ms targeting duration
    }, 600); // 600ms thinking duration

    return () => clearTimeout(aiTimerRef.current);
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState.winner || gameState.isDraw) {
      updateMemoryOnGameEnd(gameState.winner, historyRef.current);
      historyRef.current = [];
    }
  }, [gameState.winner, gameState.isDraw]);

  const reset = useCallback(() => {
    clearTimeout(aiTimerRef.current);
    historyRef.current = [];
    setIsCpuThinking(false);
    setCpuPreviewCol(null);
    setIsCpuDropping(false);
    setCpuDroppingCol(null);
    setGameState(createInitialState());
    gameBus.emit(EVENTS.GAME_RESET);
  }, []);

  return { 
    gameState, makeHumanMove, reset, 
    isCpuTurn: gameState.currentPlayer === CPU, 
    isCpuThinking, cpuPreviewCol, isCpuDropping, cpuDroppingCol,
    shouldShowPostVideoOverlay, setShouldShowPostVideoOverlay,
    closePostVideoOverlay: () => setShouldShowPostVideoOverlay(false)
  };
};

export default useConnect4CPU;
