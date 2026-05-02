import { 
  dropPiece, 
  checkWin, 
  isValidMove, 
  PLAYER1, 
  PLAYER2, 
  EMPTY, 
  COLS, 
  ROWS 
} from "../../helperFunction/helperFunction";
import { CPU_CONFIG } from "./vsCPU";
import { loadMemory } from "./cpuMemory";

const HUMAN = PLAYER1;
const CPU = PLAYER2;

/**
 * Creates a reproducible state key for memory (includes side-to-move)
 */
export const getBoardKey = (board, currentPlayer) => {
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

/**
 * Heuristic evaluation (CPU-centric)
 */
export const evaluateBoard = (board, BLOCKING_PRIORITY = true) => {
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

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
export const minimax = (board, depth, alpha, beta, maximizingPlayer, BLOCKING_PRIORITY) => {
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

/**
 * Root function to pick the smartest move based on difficulty and memory
 */
export const pickCpuMoveSmart = (board, difficulty) => {
  const valid = getValidColumns(board);
  if (valid.length === 0) return null;

  const config = CPU_CONFIG.DIFFICULTY[difficulty] || CPU_CONFIG.DIFFICULTY.Expert;
  
  let movesMade = 0;
  board.forEach(row => row.forEach(cell => { if (cell !== EMPTY) movesMade++; }));

  const depth = typeof config.MINIMAX_DEPTH === 'number' 
    ? config.MINIMAX_DEPTH 
    : config.GET_DEPTH(movesMade);

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

  const memory = loadMemory();
  const stateKey = getBoardKey(board, CPU);
  let best = { col: valid[0], score: -Infinity };

  for (const c of CPU_CONFIG.COLUMN_ORDER) {
    if (!valid.includes(c)) continue;
    const { simBoard } = simulateDrop(board, c, CPU);
    
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
