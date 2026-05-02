import { countSeparateInARows, detectNewSquares, countSeparateSquares } from "./patternDetectors";
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
      // If we have a last move, use the fast local detector (perfect for Chaos Chicken)
      if (lastMove) {
        return detectNewSquares(board, player, lastMove.row, lastMove.col, PATTERN_SIZE);
      }
      // If no last move (like the Monkey check), scan the whole board
      return { 
        count: countSeparateSquares(board, player, PATTERN_SIZE) 
      };

    default:
      console.warn(`⚠️ Unknown pattern type: ${REQUIRED_PATTERN}`);
      return { count: 0 };
  }
};
