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
  COLS,
  ROWS,
} from "../../helperFunction/helperFunction";

// Players
const HUMAN = PLAYER1; // 🔴
const CPU = PLAYER2; // 🟡

// Mistake memory (simple, no-ML): penalize past CPU moves that preceded losses
const MM_STORAGE_KEY = "c4_mistake_memory_v1";
const PENALTY_WEIGHT = 25; // how strongly to bias away from penalized moves
const MAX_PENALTY = 8; // clamp per (state, move) to avoid runaway growth
const PENALIZE_LAST_N = 3; // penalize last N CPU moves on a loss

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

const loadMemory = () => safeReadLS(MM_STORAGE_KEY);
const saveMemory = (mem) => safeWriteLS(MM_STORAGE_KEY, mem);

// Create a reproducible state key for memory (includes side-to-move)
const boardKey = (board, currentPlayer) => {
  // Join rows left→right, top→bottom; include current player
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

// Heuristic evaluation (CPU-centric):
// - Center control
// - Window scoring for 2/3/4 in-a-row chances (favor CPU, punish HUMAN)
// - Slight preference to faster wins via depth bonus handled in minimax
const evaluateBoard = (board) => {
  let score = 0;

  // Center control
  const centerCol = Math.floor(COLS / 2); // 3
  let cpuCenter = 0;
  let humanCenter = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === CPU) cpuCenter++;
    else if (board[r][centerCol] === HUMAN) humanCenter++;
  }
  score += cpuCenter * 4 - humanCenter * 4;

  const scoreWindow = (cells) => {
    const cpuCount = cells.filter((x) => x === CPU).length;
    const humanCount = cells.filter((x) => x === HUMAN).length;
    const emptyCount = cells.filter((x) => x !== CPU && x !== HUMAN).length;

    // Winning/near-winning patterns
    if (cpuCount === 4) return 100000;
    if (humanCount === 4) return -100000;

    let s = 0;
    if (cpuCount === 3 && emptyCount === 1) s += 120;
    if (cpuCount === 2 && emptyCount === 2) s += 12;

    if (humanCount === 3 && emptyCount === 1) s -= 130; // block priority
    if (humanCount === 2 && emptyCount === 2) s -= 14;

    return s;
  };

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([
        board[r][c],
        board[r][c + 1],
        board[r][c + 2],
        board[r][c + 3],
      ]);
    }
  }
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      score += scoreWindow([
        board[r][c],
        board[r + 1][c],
        board[r + 2][c],
        board[r + 3][c],
      ]);
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ]);
    }
  }
  // Diagonal up-right
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([
        board[r][c],
        board[r - 1][c + 1],
        board[r - 2][c + 2],
        board[r - 3][c + 3],
      ]);
    }
  }

  return score;
};

// Move ordering (center-first) improves alpha-beta pruning
const orderedColumns = [3, 4, 2, 5, 1, 6, 0];

const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
  const valid = getValidColumns(board);
  const noMoves = valid.length === 0;

  // Terminal or depth cutoff
  if (depth === 0 || noMoves) {
    return { col: null, score: evaluateBoard(board) };
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    let bestCol = valid[0];

    for (const c of orderedColumns) {
      if (!valid.includes(c)) continue;
      const { simBoard, row } = simulateDrop(board, c, CPU);

      // Immediate win shortcut
      if (row !== -1 && checkWin(simBoard, row, c, CPU)) {
        return { col: c, score: 1000000 + depth }; // prefer faster win
      }

      const { score } = minimax(simBoard, depth - 1, alpha, beta, false);
      if (score > bestScore) {
        bestScore = score;
        bestCol = c;
      }
      alpha = Math.max(alpha, bestScore);
      if (alpha >= beta) break; // prune
    }
    return { col: bestCol, score: bestScore };
  } else {
    // Minimizing: human
    let bestScore = Infinity;
    let bestCol = valid[0];

    for (const c of orderedColumns) {
      if (!valid.includes(c)) continue;
      const { simBoard, row } = simulateDrop(board, c, HUMAN);

      if (row !== -1 && checkWin(simBoard, row, c, HUMAN)) {
        return { col: c, score: -1000000 - depth }; // prefer faster loss detection
      }

      const { score } = minimax(simBoard, depth - 1, alpha, beta, true);
      if (score < bestScore) {
        bestScore = score;
        bestCol = c;
      }
      beta = Math.min(beta, bestScore);
      if (alpha >= beta) break; // prune
    }
    return { col: bestCol, score: bestScore };
  }
};

// Root picker: applies mistake-memory bias on top of minimax scores
const pickCpuMoveSmart = (board) => {
  const valid = getValidColumns(board);
  if (valid.length === 0) return null;

  // Choose dynamic depth (conservative for mobile)
  let movesMade = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v === PLAYER1 || v === PLAYER2) movesMade++;
    }
  const depth = movesMade < 8 ? 5 : movesMade < 18 ? 5 : 6; // slightly deeper in late game

  const stateKey = boardKey(board, CPU);
  const memory = loadMemory();

  let best = { col: valid[0], score: -Infinity };

  // Optional quick tactical checks to reduce tree (win/block 1-ply)
  // 1) Win now
  for (const c of valid) {
    const { simBoard, row } = simulateDrop(board, c, CPU);
    if (row !== -1 && checkWin(simBoard, row, c, CPU)) return c;
  }
  // 2) Block human's win
  for (const c of valid) {
    const { simBoard, row } = simulateDrop(board, c, HUMAN);
    if (row !== -1 && checkWin(simBoard, row, c, HUMAN)) return c;
  }

  // Evaluate with minimax, adjust with memory penalties
  for (const c of orderedColumns) {
    if (!valid.includes(c)) continue;

    const { simBoard, row } = simulateDrop(board, c, CPU);

    // If our move hands human an immediate win next turn, strongly punish
    let antiTrapPenalty = 0;
    const humanWinsNext = getValidColumns(simBoard).some((hc) => {
      const { simBoard: hb, row: hr } = simulateDrop(simBoard, hc, HUMAN);
      return hr !== -1 && checkWin(hb, hr, hc, HUMAN);
    });
    if (humanWinsNext) antiTrapPenalty = 150;

    const res = minimax(simBoard, depth - 1, -Infinity, Infinity, false);
    const baseScore = res.score;

    const memPenalty = memory[`${stateKey}|${c}`] || 0;
    const adjusted = baseScore - memPenalty * PENALTY_WEIGHT - antiTrapPenalty;

    if (adjusted > best.score) {
      best = { col: c, score: adjusted };
    }
  }

  return best.col ?? valid[0];
};

// Update memory at game end
const updateMemoryOnGameEnd = ({ winner }, historyRef) => {
  if (!winner) return;
  const mem = loadMemory();

  if (winner === HUMAN) {
    // Penalize last N CPU moves from this game
    const cpuMoves = historyRef.current.filter((h) => h.player === CPU);
    const toPenalize = cpuMoves.slice(-PENALIZE_LAST_N);
    for (const h of toPenalize) {
      const key = `${h.key}|${h.col}`;
      const prev = mem[key] || 0;
      mem[key] = Math.min(MAX_PENALTY, prev + 1);
    }
  } else if (winner === CPU) {
    // Light decay (forgive) to allow exploration over time
    for (const k of Object.keys(mem)) {
      mem[k] = Math.max(0, (mem[k] || 0) - 1);
      if (mem[k] === 0) delete mem[k];
    }
  }
  saveMemory(mem);
  // Clear in-game history for next round
  historyRef.current = [];
};

export const useConnect4CPU = () => {
  const [gameState, setGameState] = useState(resetGame);
  const [isCpuDropping, setIsCpuDropping] = useState(false);
  const [cpuDroppingCol, setCpuDroppingCol] = useState(null);
  // CHANGE: Add state to trigger PostVideoOverlay when CPU wins
  const [shouldShowPostVideoOverlay, setShouldShowPostVideoOverlay] = useState(false);
  const aiTimerRef = useRef(null);
  const historyRef = useRef([]); // track states & CPU moves for mistake memory

  const makeHumanMove = useCallback(
    (col) => {
      const { board, currentPlayer, winner, isDraw } = gameState;
      if (
        winner ||
        isDraw ||
        currentPlayer !== HUMAN ||
        !isValidMove(board, col)
      )
        return false;

      const { newBoard, row } = dropPiece(board, col, HUMAN);
      let next = { ...gameState, board: newBoard };

      const winResult = checkWin(newBoard, row, col, HUMAN);
      if (winResult) {
        next.winner = HUMAN;
        next.winningLine = winResult;
      } else if (isBoardFull(newBoard)) {
        next.isDraw = true;
      } else {
        next.currentPlayer = getNextPlayer(currentPlayer); // CPU turn
      }

      setGameState(next);
      return true;
    },
    [gameState],
  );

  // CPU turn effect
  useEffect(() => {
    const { board, currentPlayer, winner, isDraw } = gameState;
    if (winner || isDraw || currentPlayer !== CPU) return;

    aiTimerRef.current = setTimeout(() => {
      const col = pickCpuMoveSmart(board);
      if (col === null) {
        setGameState((prev) => ({ ...prev, isDraw: true }));
        return;
      }

      // Record state for learning before applying the move
      historyRef.current.push({
        key: boardKey(board, CPU),
        col,
        player: CPU,
      });

      setIsCpuDropping(true);
      setCpuDroppingCol(col);

      // Calculate animation duration to match Board component timing
      let targetRow = -1;
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][col] === "⚪") {
          targetRow = row;
          break;
        }
      }
      const distance = board.length - targetRow;
      const animationDuration = 230 + Math.abs(distance) * 50;

      // Delay the actual game state update to match exact animation duration
      setTimeout(() => {
        const { newBoard, row } = dropPiece(board, col, CPU);
        setGameState((prev) => {
          const next = { ...prev, board: newBoard };
          const winResult = checkWin(newBoard, row, col, CPU);
          if (winResult) {
            next.winner = CPU;
            next.winningLine = winResult;
          } else if (isBoardFull(newBoard)) {
            next.isDraw = true;
          } else {
            next.currentPlayer = getNextPlayer(prev.currentPlayer); // back to human
          }
          return next;
        });

        setIsCpuDropping(false);
        setCpuDroppingCol(null);

        // CHANGE: Check if CPU won and trigger PostVideoOverlay after 0.5 seconds
        const { newBoard: finalBoard, row: finalRow } = dropPiece(board, col, CPU);
        if (checkWin(finalBoard, finalRow, col, CPU)) {
          setTimeout(() => {
            setShouldShowPostVideoOverlay(true);
          }, 1000);
        }
      }, animationDuration);
    }, 350); // small delay for UX

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [gameState]);


  // Learn at end of game (penalize losing CPU moves; forgive on win)
  useEffect(() => {
    if (gameState.winner || gameState.isDraw) {
      updateMemoryOnGameEnd(gameState, historyRef);
    }
  }, [gameState.winner, gameState.isDraw]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    historyRef.current = [];
    setIsCpuDropping(false);
    setCpuDroppingCol(null);
    // CHANGE: Reset PostVideoOverlay state on game reset
    setShouldShowPostVideoOverlay(false);
    setGameState(resetGame());
  }, []);

  // CHANGE: Add function to close PostVideoOverlay
  const closePostVideoOverlay = useCallback(() => {
    setShouldShowPostVideoOverlay(false);
  }, []);

  const isCpuTurn = gameState.currentPlayer === CPU;

  return { 
    gameState, 
    makeHumanMove, 
    reset, 
    isCpuTurn, 
    HUMAN, 
    CPU,
    isCpuDropping,
    cpuDroppingCol,
    // CHANGE: Export PostVideoOverlay state and controls
    shouldShowPostVideoOverlay,
    closePostVideoOverlay
  };
};

export default useConnect4CPU;
