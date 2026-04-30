import { ROWS, COLS, EMPTY } from "./helperFunction";

// Monkey Mayhem voice lines
const MONKEY_VOICE_LINES = [
  "Time to flip things up!",
  "Ooo-ooo! Gravity is my playground!",
  "Board go brrr!",
  "Monkey business time!",
  "Let's turn this upside down!",
];

export const countSeparateThreeInARows = (board, player) => {
  console.log("🔍 COUNTING 3-IN-A-ROWS FOR PLAYER:", player);
  console.log(
    "📋 CURRENT BOARD:",
    board.map((row) => row.join("")),
  );

  const usedCells = new Set();
  let count = 0;

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];

  const directionNames = [
    "horizontal",
    "vertical",
    "diagonal-down-right",
    "diagonal-up-right",
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== player) continue;

      for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
        const [dr, dc] = directions[dirIndex];
        const dirName = directionNames[dirIndex];

        const cells = [];
        let valid = true;

        for (let i = 0; i < 3; i++) {
          const r = row + i * dr;
          const c = col + i * dc;

          if (
            r < 0 ||
            r >= ROWS ||
            c < 0 ||
            c >= COLS ||
            board[r][c] !== player
          ) {
            valid = false;
            break;
          }

          const cellKey = `${r},${c}`;
          if (usedCells.has(cellKey)) {
            console.log("❌ CELL ALREADY USED:", {
              cell: cellKey,
              direction: dirName,
              startPos: `${row},${col}`,
            });
            valid = false;
            break;
          }

          cells.push(cellKey);
        }

        if (valid) {
          cells.forEach((cell) => usedCells.add(cell));
          count++;

          console.log("✅ FOUND 3-IN-A-ROW:", {
            direction: dirName,
            startPos: `${row},${col}`,
            cells: cells,
            totalCount: count,
          });
        }
      }
    }
  }

  console.log("📊 FINAL 3-IN-A-ROW COUNT:", {
    player,
    count,
    usedCells: Array.from(usedCells),
  });

  return count;
};

export const shouldTriggerMonkeyMayhem = (board, player, monkeyMayhemState) => {
  console.log("🐒 CHECKING MONKEY MAYHEM TRIGGER:", {
    player,
    monkeyMayhemState,
  });

  if (monkeyMayhemState.wasOffered || monkeyMayhemState.wasUsed) {
    console.log("❌ MONKEY MAYHEM ALREADY OFFERED/USED:", monkeyMayhemState);
    return false;
  }

  const threeInARowCount = countSeparateThreeInARows(board, player);
  const shouldTrigger = threeInARowCount >= 1;

  console.log("🎯 MONKEY MAYHEM DECISION:", {
    player,
    threeInARowCount,
    requiredCount: 1,
    shouldTrigger,
    isFirstOpportunity: !monkeyMayhemState.wasOffered,
  });

  return shouldTrigger;
};

export const flipBoardUpsideDown = (board) => {
  console.log("🔄 FLIPPING BOARD UPSIDE DOWN");
  console.log(
    "📋 BEFORE FLIP:",
    board.map((row) => row.join("")),
  );

  const newBoard = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(EMPTY));

  for (let col = 0; col < COLS; col++) {
    const pieces = [];

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] !== EMPTY) {
        pieces.push(board[row][col]);
      }
    }

    console.log(`📍 COLUMN ${col} PIECES:`, pieces);

    // Drop pieces from new top (flipped gravity) - pieces stack from top down
    for (let i = 0; i < pieces.length; i++) {
      newBoard[i][col] = pieces[i];
    }
  }

  console.log(
    "📋 AFTER FLIP:",
    newBoard.map((row) => row.join("")),
  );
  return newBoard;
};

export const maybeStealDisc = (board, triggeringPlayer, isUpsideDown = false) => {
  if (Math.random() > 0.5) {
    console.log("🍌 NO DISC STOLEN (50% chance)");
    return board;
  }

  console.log("🍌 MONKEY STEALING A DISC! (50% chance)");

  const opponentPlayer = triggeringPlayer === "🔴" ? "🟡" : "🔴";
  
  const opponentCells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === opponentPlayer) {
        opponentCells.push({ row, col });
      }
    }
  }

  if (opponentCells.length === 0) {
    console.log("❌ NO OPPONENT DISCS TO STEAL");
    return board;
  }

  const randomCell =
    opponentCells[Math.floor(Math.random() * opponentCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[randomCell.row][randomCell.col] = EMPTY;

  console.log("🍌 STOLE DISC FROM OPPONENT:", { 
    cell: randomCell, 
    opponent: opponentPlayer,
    triggeredBy: triggeringPlayer,
    isUpsideDown 
  });

  // Apply gravity based on board orientation
  const pieces = [];
  
  for (let row = 0; row < ROWS; row++) {
    if (newBoard[row][randomCell.col] !== EMPTY) {
      pieces.push(newBoard[row][randomCell.col]);
      newBoard[row][randomCell.col] = EMPTY;
    }
  }

  // Re-drop pieces according to current gravity orientation
  if (isUpsideDown) {
    // In upside-down mode, pieces stack from top (row 0) downward
    for (let i = 0; i < pieces.length; i++) {
      newBoard[i][randomCell.col] = pieces[i];
    }
    console.log("🙃 APPLIED UPSIDE-DOWN GRAVITY TO COLUMN", randomCell.col);
  } else {
    // In normal mode, pieces stack from bottom (row ROWS-1) upward
    for (let i = 0; i < pieces.length; i++) {
      newBoard[ROWS - 1 - i][randomCell.col] = pieces[i];
    }
    console.log("⬇️ APPLIED NORMAL GRAVITY TO COLUMN", randomCell.col);
  }

  console.log(
    "📋 AFTER DISC THEFT:",
    newBoard.map((row) => row.join("")),
  );
  return newBoard;
};

export const getRandomMonkeyVoiceLine = () => {
  return MONKEY_VOICE_LINES[
    Math.floor(Math.random() * MONKEY_VOICE_LINES.length)
  ];
};

export const isMonkeyWinner = (winner, isUpsideDown) => {
  return winner && isUpsideDown;
};

export const dropPieceUpsideDown = (board, col, player) => {
  console.log("🙃 DROPPING PIECE UPSIDE DOWN:", { col, player });
  console.log("🙃 COLUMN STATE BEFORE DROP:", board.map(row => row[col]));

  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      console.log("✅ UPSIDE DOWN DROP SUCCESS:", { row, col, player });
      console.log("🙃 COLUMN STATE AFTER DROP:", newBoard.map(r => r[col]));
      return { newBoard, row };
    }
  }

  console.log("❌ UPSIDE DOWN COLUMN FULL:", col);
  return { newBoard: board, row: -1 };
};

export const isValidMoveUpsideDown = (board, col) => {
  if (col < 0 || col >= COLS) return false;
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === EMPTY) {
      return true;
    }
  }
  return false;
};

export const isBoardFullUpsideDown = (board) => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === EMPTY) {
        return false;
      }
    }
  }
  return true;
};