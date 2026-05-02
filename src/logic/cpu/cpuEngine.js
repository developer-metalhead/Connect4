import { 
  dropPiece, 
  checkWin, 
  isValidMove 
} from "../../logic/core/engine";
import { PLAYERS, CORE_CONFIG } from "../../logic/coreConfig";
import { loadMemory } from "../../logic/cpu/cpuMemory";

const HUMAN = PLAYERS.P1;
const CPU = PLAYERS.P2;
const { EMPTY, WIN_LENGTH } = CORE_CONFIG;

/**
 * Creates a reproducible state key for memory
 */
export const getBoardKey = (board, currentPlayer) => {
  const grid = board.map((r) => r.join("")).join("/");
  return `${currentPlayer}|${grid}`;
};

/**
 * Standard middle-out column search
 */
const COLUMN_ORDER = [3, 2, 4, 1, 5, 0, 6];

/**
 * Returns valid columns for the standard grid
 */
const getValidColumns = (board) => {
  const cols = [];
  for (let c = 0; c < 7; c++) if (isValidMove(board, c)) cols.push(c);
  return cols;
};

/**
 * Heuristic evaluation (Standard 6x7)
 */
export const evaluateBoard = (board, BLOCKING_PRIORITY = true) => {
  const rows = 6;
  const cols = 7;
  let score = 0;

  // 1. Center Control
  const centerCol = 3;
  for (let r = 0; r < rows; r++) {
    if (board[r][centerCol] === CPU) score += 3;
    else if (board[r][centerCol] === HUMAN) score -= 3;
  }

  const scoreWindow = (cells) => {
    const cpuCount = cells.filter((x) => x === CPU).length;
    const humanCount = cells.filter((x) => x === HUMAN).length;
    const emptyCount = cells.filter((x) => x === EMPTY).length;

    if (cpuCount === 4) return 10000;
    if (humanCount === 4) return -10000;

    let s = 0;
    if (cpuCount === 3 && emptyCount === 1) s += 5;
    if (cpuCount === 2 && emptyCount === 2) s += 2;
    
    if (BLOCKING_PRIORITY) {
      if (humanCount === 3 && emptyCount === 1) s -= 80;
      if (humanCount === 2 && emptyCount === 2) s -= 10;
    }
    return s;
  };

  // Scans
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]]);
    }
  }
  for (let r = 0; r <= rows - 4; r++) {
    for (let c = 0; c < cols; c++) {
      score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]]);
    }
  }
  for (let r = 0; r <= rows - 4; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]);
    }
  }
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c <= cols - 4; c++) {
      score += scoreWindow([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]]);
    }
  }

  return score;
};

/**
 * Minimax with Alpha-Beta
 */
export const minimax = (board, depth, alpha, beta, maximizingPlayer, BLOCKING_PRIORITY) => {
  const valid = getValidColumns(board);
  if (depth === 0 || valid.length === 0) {
    return { col: null, score: evaluateBoard(board, BLOCKING_PRIORITY) };
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    let bestCol = valid[0];
    for (const c of COLUMN_ORDER) {
      if (!valid.includes(c)) continue;
      const { newBoard, row } = dropPiece(board, c, CPU);
      if (row !== -1 && checkWin(newBoard, row, c, CPU, 4)) return { col: c, score: 10000 + depth };
      const res = minimax(newBoard, depth - 1, alpha, beta, false, BLOCKING_PRIORITY);
      if (res.score > bestScore) { bestScore = res.score; bestCol = c; }
      alpha = Math.max(alpha, bestScore);
      if (alpha >= beta) break;
    }
    return { col: bestCol, score: bestScore };
  } else {
    let bestScore = Infinity;
    let bestCol = valid[0];
    for (const c of COLUMN_ORDER) {
      if (!valid.includes(c)) continue;
      const { newBoard, row } = dropPiece(board, c, HUMAN);
      if (row !== -1 && checkWin(newBoard, row, c, HUMAN, 4)) return { col: c, score: -10000 - depth };
      const res = minimax(newBoard, depth - 1, alpha, beta, true, BLOCKING_PRIORITY);
      if (res.score < bestScore) { bestScore = res.score; bestCol = c; }
      beta = Math.min(beta, bestScore);
      if (alpha >= beta) break;
    }
    return { col: bestCol, score: bestScore };
  }
};

/**
 * Root pickMove function
 */
export const pickCpuMoveSmart = (board, difficulty) => {
  const valid = getValidColumns(board);
  if (valid.length === 0) return null;

  // Standard difficulty mapping
  const depth = difficulty === 'Expert' ? 5 : difficulty === 'Skilled' ? 3 : 1;
  const BLOCKING_PRIORITY = true;

  // Tactical overrides
  for (const c of valid) {
    const { newBoard, row } = dropPiece(board, c, CPU);
    if (row !== -1 && checkWin(newBoard, row, c, CPU, 4)) return c;
  }
  for (const c of valid) {
    const { newBoard, row } = dropPiece(board, c, HUMAN);
    if (row !== -1 && checkWin(newBoard, row, c, HUMAN, 4)) return c;
  }

  const memory = loadMemory();
  const stateKey = getBoardKey(board, CPU);
  let best = { col: valid[0], score: -Infinity };

  for (const c of COLUMN_ORDER) {
    if (!valid.includes(c)) continue;
    const { newBoard } = dropPiece(board, c, CPU);
    const res = minimax(newBoard, depth - 1, -Infinity, Infinity, false, BLOCKING_PRIORITY);
    
    const memPenalty = (memory[`${stateKey}|${c}`] || 0) * 50;
    const score = res.score - memPenalty;

    if (score > best.score) { best = { col: c, score }; }
  }

  return best.col;
};
