import { PLAYER1, PLAYER2 } from "../../helperFunction/helperFunction";
import { CPU_CONFIG } from "./vsCPU";

const HUMAN = PLAYER1;
const CPU = PLAYER2;

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
    // ignore write errors
  }
};

/**
 * Load mistake memory from local storage
 */
export const loadMemory = () => safeReadLS(CPU_CONFIG.MEMORY.STORAGE_KEY);

/**
 * Save mistake memory to local storage
 */
export const saveMemory = (mem) => safeWriteLS(CPU_CONFIG.MEMORY.STORAGE_KEY, mem);

/**
 * Update the AI's memory at the end of a game
 */
export const updateMemoryOnGameEnd = (winner, history) => {
  if (!winner) return;
  const mem = loadMemory();
  const M = CPU_CONFIG.MEMORY;

  if (winner === HUMAN) {
    // Penalize last N CPU moves from this game
    const cpuMoves = history.filter(h => h.player === CPU).slice(-M.PENALIZE_LAST_N);
    cpuMoves.forEach(h => {
      const key = `${h.key}|${h.col}`;
      mem[key] = Math.min(M.MAX_PENALTY, (mem[key] || 0) + 1);
    });
  } else if (winner === CPU) {
    // Light decay (forgive) to allow exploration over time
    Object.keys(mem).forEach(k => {
      mem[k] = Math.max(0, mem[k] - 1);
      if (mem[k] === 0) delete mem[k];
    });
  }
  saveMemory(mem);
};
