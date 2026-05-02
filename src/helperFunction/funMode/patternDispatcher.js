import { countSeparateInARows, detectNewSquares } from "./patternDetectors";
import { PATTERNS } from "../../logic/constants";

/**
 * PATTERN DISPATCHER
 * This function looks at the configuration and decides which 
 * detection algorithm to run. This is what enables "Plug and Play".
 */
export const detectPattern = (board, player, config, lastMove = null) => {
  const { REQUIRED_PATTERN, PATTERN_SIZE } = config;

  console.log(`🎯 DISPATCHER: Hunting for ${REQUIRED_PATTERN} (Size: ${PATTERN_SIZE})`);

  switch (REQUIRED_PATTERN) {
    case PATTERNS.IN_A_ROW:
      // Detects contiguous lines of a certain length
      return {
        count: countSeparateInARows(board, player, PATTERN_SIZE)
      };

    case PATTERNS.SQUARE:
      // Detects squares of a certain dimension (requires last move for instant trigger)
      if (lastMove) {
        return detectNewSquares(board, player, lastMove.row, lastMove.col, PATTERN_SIZE);
      }
      // If no last move provided (rare for chicken), we'd need a full board square scanner
      // For now, we return 0 as the chicken always triggers on placement
      return { count: 0, squares: [] };

    default:
      console.warn(`⚠️ Unknown pattern type: ${REQUIRED_PATTERN}`);
      return { count: 0 };
  }
};
