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
  COLS,
  ROWS,
  ANIMATION_CONFIG,
  calculateDropDuration,
} from "../../helperFunction/helperFunction";
import { CPU_CONFIG } from "../../logic/vsCPU";

// Players
const HUMAN = PLAYER1; // 🔴
const CPU = PLAYER2; // 🟡

const safeReadLS = (key) => {
  try {
    const s = window.localStorage.getItem(key);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
};
const safeWriteLS = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (incognito/storage full)
  }
};

const loadMemory = () => safeReadLS(CPU_CONFIG.MEMORY.STORAGE_KEY);
const saveMemory = (mem) => safeWriteLS(CPU_CONFIG.MEMORY.STORAGE_KEY, mem);

// Create a reproducible state key for memory (includes side-to-move)
const boardKey = (board, currentPlayer) => {
  const grid = board.map((r) => r.join("")).join("/");
  return `${currentPlayer}|${grid}`;
};

const getValidColumns = (board) => {
  const cols = [];
  for (let c = 0; c < COLS; c++) if (isValidMove(board, c)) cols.push(c);
  return cols;
};

const simulateDrop = (board, col, player) => {
  const { newBoard, row } = dropPiece(board, col, player);
  return { simBoard: newBoard, row };
};

// Heuristic evaluation (CPU-centric)
const evaluateBoard = (board, BLOCKING_PRIORITY = true) => {
  let score = 0;
  const S = CPU_CONFIG.SCORES;

  // Center control
  const centerCol = Math.floor(COLS / 2);
  let cpuCenter = 0;
  let humanCenter = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === CPU) cpuCenter++;
    else if (board[r][centerCol] === HUMAN) humanCenter++;
  }
  score += (cpuCenter - humanCenter) * S.CENTER_CONTROL;

  const scoreWindow = (cells) => {
    const cpuCount = cells.filter((x) => x === CPU).length;
    const humanCount = cells.filter((x) => x === HUMAN).length;
    const emptyCount = cells.filter((x) => x === EMPTY).length;

    if (cpuCount === 4) return S.WIN;
    if (humanCount === 4) return S.LOSS;

    let s = 0;
    if (cpuCount === 3 && emptyCount === 1) s += S.THREE_IN_ROW;
    if (cpuCount === 2 && emptyCount === 2) s += S.TWO_IN_ROW;
    
    // Only consider opponent threats if BLOCKING_PRIORITY is enabled
    if (BLOCKING_PRIORITY) {
      if (humanCount === 3 && emptyCount === 1) s += S.OPPONENT_THREE;
      if (humanCount === 2 && emptyCount === 2) s += S.OPPONENT_TWO;
    }

    return s;
  };

  // Scan board for windows
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]]);
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]]);
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]);
    }
  }
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]]);
    }
  }

  return score;
};

const minimax = (board, depth, alpha, beta, maximizingPlayer, BLOCKING_PRIORITY) => {
  const valid = getValidColumns(board);
  if (depth === 0 || valid.length === 0) {
    return { col: null, score: evaluateBoard(board, BLOCKING_PRIORITY) };
  }

  const S = CPU_CONFIG.SCORES;

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    let bestCol = valid[0];
    for (const c of CPU_CONFIG.COLUMN_ORDER) {
      if (!valid.includes(c)) continue;
      const { simBoard, row } = simulateDrop(board, c, CPU);
      if (row !== -1 && checkWin(simBoard, row, c, CPU)) return { col: c, score: S.WIN + depth };
      const res = minimax(simBoard, depth - 1, alpha, beta, false, BLOCKING_PRIORITY);
      if (res.score > bestScore) { bestScore = res.score; bestCol = c; }
      alpha = Math.max(alpha, bestScore);
      if (alpha >= beta) break;
    }
    return { col: bestCol, score: bestScore };
  } else {
    let bestScore = Infinity;
    let bestCol = valid[0];
    for (const c of CPU_CONFIG.COLUMN_ORDER) {
      if (!valid.includes(c)) continue;
      const { simBoard, row } = simulateDrop(board, c, HUMAN);
      if (row !== -1 && checkWin(simBoard, row, c, HUMAN)) return { col: c, score: S.LOSS - depth };
      const res = minimax(simBoard, depth - 1, alpha, beta, true, BLOCKING_PRIORITY);
      if (res.score < bestScore) { bestScore = res.score; bestCol = c; }
      beta = Math.min(beta, bestScore);
      if (alpha >= beta) break;
    }
    return { col: bestCol, score: bestScore };
  }
};

const pickCpuMoveSmart = (board, difficulty) => {
  const valid = getValidColumns(board);
  if (valid.length === 0) return null;

  const config = CPU_CONFIG.DIFFICULTY[difficulty] || CPU_CONFIG.DIFFICULTY.Expert;

  console.log('hey config',config)
  
  // Calculate game progress
  let movesMade = 0;
  board.forEach(row => row.forEach(cell => { if (cell !== EMPTY) movesMade++; }));

  const depth = typeof config.MINIMAX_DEPTH === 'number' 
    ? config.MINIMAX_DEPTH 
    : config.GET_DEPTH(movesMade);

  // Random move chance
  if (config.RANDOM_MOVE_CHANCE > 0 && Math.random() < config.RANDOM_MOVE_CHANCE) {
    return valid[Math.floor(Math.random() * valid.length)];
  }

  // Tactical overrides
  for (const c of valid) {
    const { simBoard, row } = simulateDrop(board, c, CPU);
    if (row !== -1 && checkWin(simBoard, row, c, CPU)) return c;
  }
  if (config.BLOCKING_PRIORITY) {
    for (const c of valid) {
      const { simBoard, row } = simulateDrop(board, c, HUMAN);
      if (row !== -1 && checkWin(simBoard, row, c, HUMAN)) return c;
    }
  }

  // Memory & Minimax
  const memory = loadMemory();
  const stateKey = boardKey(board, CPU);
  let best = { col: valid[0], score: -Infinity };

  for (const c of CPU_CONFIG.COLUMN_ORDER) {
    if (!valid.includes(c)) continue;
    const { simBoard } = simulateDrop(board, c, CPU);
    
    // Anti-trap check (Only if AI cares about blocking)
    let antiTrapPenalty = 0;
    if (config.BLOCKING_PRIORITY) {
      if (getValidColumns(simBoard).some(hc => {
        const { simBoard: hb, row: hr } = simulateDrop(simBoard, hc, HUMAN);
        return hr !== -1 && checkWin(hb, hr, hc, HUMAN);
      })) antiTrapPenalty = 150;
    }

    const res = minimax(simBoard, depth - 1, -Infinity, Infinity, false, config.BLOCKING_PRIORITY);
    const memPenalty = memory[`${stateKey}|${c}`] || 0;
    const adjusted = res.score - (memPenalty * CPU_CONFIG.MEMORY.PENALTY_WEIGHT) - antiTrapPenalty;

    if (adjusted > best.score) { best = { col: c, score: adjusted }; }
  }

  return best.col;
};

const updateMemoryOnGameEnd = ({ winner }, historyRef) => {
  if (!winner) return;
  const mem = loadMemory();
  const M = CPU_CONFIG.MEMORY;

  if (winner === HUMAN) {
    const cpuMoves = historyRef.current.filter(h => h.player === CPU).slice(-M.PENALIZE_LAST_N);
    cpuMoves.forEach(h => {
      const key = `${h.key}|${h.col}`;
      mem[key] = Math.min(M.MAX_PENALTY, (mem[key] || 0) + 1);
    });
  } else {
    Object.keys(mem).forEach(k => {
      mem[k] = Math.max(0, mem[k] - 1);
      if (mem[k] === 0) delete mem[k];
    });
  }
  saveMemory(mem);
  historyRef.current = [];
};

export const useConnect4CPU = (difficulty = "Expert") => {
  const [gameState, setGameState] = useState(resetGame);
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [cpuPreviewCol, setCpuPreviewCol] = useState(null);
  const [isCpuDropping, setIsCpuDropping] = useState(false);
  const [cpuDroppingCol, setCpuDroppingCol] = useState(null);
  const [shouldShowPostVideoOverlay, setShouldShowPostVideoOverlay] = useState(false);
  const aiTimerRef = useRef(null);
  const historyRef = useRef([]);

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

  useEffect(() => {
    const { board, currentPlayer, winner, isDraw } = gameState;
    if (winner || isDraw || currentPlayer !== CPU) return;

    aiTimerRef.current = setTimeout(() => {
      const col = pickCpuMoveSmart(board, difficulty);
      if (col === null) { setGameState(prev => ({ ...prev, isDraw: true })); return; }

      setIsCpuThinking(true);
      setCpuPreviewCol(col);

      setTimeout(() => {
        historyRef.current.push({ key: boardKey(board, CPU), col, player: CPU });
        setIsCpuThinking(false);
        setCpuPreviewCol(null);
        setIsCpuDropping(true);
        setCpuDroppingCol(col);

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

  useEffect(() => {
    if (gameState.winner || gameState.isDraw) updateMemoryOnGameEnd(gameState, historyRef);
  }, [gameState.winner, gameState.isDraw]);

  const reset = useCallback(() => {
    clearTimeout(aiTimerRef.current);
    historyRef.current = [];
    setIsCpuThinking(false);
    setIsCpuDropping(false);
    setIsCpuThinking(false);
    setCpuPreviewCol(null);
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
