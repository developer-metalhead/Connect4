import { findPatternAt, findAllPatterns } from "../../logic/patterns/patternEngine";

/**
 * PATTERN BRIDGE (STANDARDIZED)
 * Standardized to handle { row, col } objects for UI compatibility.
 */

export const detectPattern = (board, row, col, player, patternObj) => {
  const results = findPatternAt(board, row, col, player, patternObj);
  // Return the first piece of each found pattern for trigger tracking
  return results.map(res => ({ row: res.coords[0].row, col: res.coords[0].col }));
};

export const countPatternsAll = (board, player, patternObj) => {
  const results = findAllPatterns(board, player, patternObj);
  return results.length;
};
