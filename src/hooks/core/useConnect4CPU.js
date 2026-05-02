/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  resetGame,
  dropPiece,
  checkWin,
  isBoardFull,
  isValidMove,
  getNextPlayer,
  PLAYER1,
  PLAYER2,
  EMPTY,
  ANIMATION_CONFIG,
  calculateDropDuration,
} from "../../helperFunction/helperFunction";
import { pickCpuMoveSmart, getBoardKey } from "../../logic/cpu/cpuEngine";
import { updateMemoryOnGameEnd } from "../../logic/cpu/cpuMemory";

// Players
const HUMAN = PLAYER1; // 🔴
const CPU = PLAYER2; // 🟡

export const useConnect4CPU = (difficulty = "Expert") => {
  const [gameState, setGameState] = useState(resetGame);
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [cpuPreviewCol, setCpuPreviewCol] = useState(null);
  const [isCpuDropping, setIsCpuDropping] = useState(false);
  const [cpuDroppingCol, setCpuDroppingCol] = useState(null);
  const [shouldShowPostVideoOverlay, setShouldShowPostVideoOverlay] = useState(false);
  
  const aiTimerRef = useRef(null);
  const historyRef = useRef([]);

  /**
   * Main player move handler
   */
  const makeHumanMove = useCallback((col) => {
    if (gameState.winner || gameState.isDraw || gameState.currentPlayer !== HUMAN || !isValidMove(gameState.board, col) || isCpuThinking) return false;
    
    const { newBoard, row } = dropPiece(gameState.board, col, HUMAN);
    const winResult = checkWin(newBoard, row, col, HUMAN);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      winner: winResult ? HUMAN : prev.winner,
      winningLine: winResult || prev.winningLine,
      isDraw: !winResult && isBoardFull(newBoard),
      currentPlayer: winResult ? HUMAN : getNextPlayer(HUMAN)
    }));
    
    return true;
  }, [gameState, isCpuThinking]);

  /**
   * CPU turn effect (Handles timing and visual sequencing)
   */
  useEffect(() => {
    const { board, currentPlayer, winner, isDraw } = gameState;
    if (winner || isDraw || currentPlayer !== CPU) return;

    aiTimerRef.current = setTimeout(() => {
      // 1. ENGINE: Pick the move
      const col = pickCpuMoveSmart(board, difficulty);
      if (col === null) { setGameState(prev => ({ ...prev, isDraw: true })); return; }

      // 2. UI: Targeting Phase (Show Highlight & Preview)
      setIsCpuThinking(true);
      setCpuPreviewCol(col);

      setTimeout(() => {
        // Record state for memory
        historyRef.current.push({ key: getBoardKey(board, CPU), col, player: CPU });
        
        // 3. UI: Dropping Phase
        setIsCpuThinking(false);
        setCpuPreviewCol(null);
        setIsCpuDropping(true);
        setCpuDroppingCol(col);

        // Synchronize state update with animation duration
        let targetRow = -1;
        for (let row = board.length - 1; row >= 0; row--) { if (board[row][col] === EMPTY) { targetRow = row; break; } }
        const animationDuration = calculateDropDuration(board.length - targetRow);

        setTimeout(() => {
          const { newBoard, row } = dropPiece(board, col, CPU);
          const winResult = checkWin(newBoard, row, col, CPU);
          
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            winner: winResult ? CPU : prev.winner,
            winningLine: winResult || prev.winningLine,
            isDraw: !winResult && isBoardFull(newBoard),
            currentPlayer: winResult ? CPU : getNextPlayer(CPU)
          }));
          
          setIsCpuDropping(false);
          setCpuDroppingCol(null);
        }, animationDuration + ANIMATION_CONFIG.CPU_POST_DROP_DELAY);
      }, ANIMATION_CONFIG.CPU_TARGETING_DURATION);
    }, ANIMATION_CONFIG.CPU_THINKING_DURATION);

    return () => clearTimeout(aiTimerRef.current);
  }, [gameState, difficulty]);

  /**
   * Learning effect (Updates memory at end of game)
   */
  useEffect(() => {
    if (gameState.winner || gameState.isDraw) {
      updateMemoryOnGameEnd(gameState.winner, historyRef.current);
      historyRef.current = []; // Reset for next game
    }
  }, [gameState.winner, gameState.isDraw]);

  /**
   * Reset game state
   */
  const reset = useCallback(() => {
    clearTimeout(aiTimerRef.current);
    historyRef.current = [];
    setIsCpuThinking(false);
    setCpuPreviewCol(null);
    setIsCpuDropping(false);
    setCpuDroppingCol(null);
    setGameState(resetGame());
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
