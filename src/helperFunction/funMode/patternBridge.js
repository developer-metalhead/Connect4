import { findPatternAt, findAllPatterns } from "../../logic/patterns/patternEngine";

/**
 * PATTERN BRIDGE (COUPLED)
 * Standardized to handle { type, ...params } objects.
 */

export const detectPattern = (board, row, col, player, patternObj) => {
  const results = findPatternAt(board, row, col, player, patternObj);
  return results.map(res => ({ r: res.coords[0].r, c: res.coords[0].c }));
};

export const countPatternsAll = (board, player, patternObj) => {
  const results = findAllPatterns(board, player, patternObj);
  return results.length;
};
