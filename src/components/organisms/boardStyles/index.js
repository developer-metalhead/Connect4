import { useState } from "react";
import {
  BoardContainer,
  Row,
  Cell,
  PreviewRow,
  ColumnHighlight,
  FallingDisc,
  WinningLineWrapper,
  WinningLine,
} from "./index.style";

const Board = ({
  board,
  currentPlayer,
  winner,
  isDraw,
  onDrop,
  canInteract = true,
  soundManager, // Add sound manager prop
  isUpsideDown = false, // CHANGE: Add isUpsideDown prop
  gravityAnimation = null, // NEW: batch animation plan for restoring gravity
  // CHANGE: Add CPU dropping props for animation
  isCpuDropping = false,
  cpuDroppingCol = null,
  winningLine = null, // CHANGE: Add winningLine prop
}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);
  const [fallingDisc, setFallingDisc] = useState(null);
  // CHANGE: Add touch state for mobile interactions
  const [touchCol, setTouchCol] = useState(null);
  const [touchTimeout, setTouchTimeout] = useState(null);

  // Build a quick mask to hide source cells during mass-fall overlays
  const maskedKeys =
    Array.isArray(gravityAnimation) && gravityAnimation.length > 0
      ? new Set(gravityAnimation.map((a) => `${a.fromRow},${a.col}`))
      : null;

  // CHANGE: Clear touch timeout when component unmounts or state changes
  const clearTouchTimeout = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
  };

  // CHANGE: Helper function to get column from touch coordinates
  const getColumnFromTouch = (touch) => {
    const boardElement = document.querySelector('[data-board-container]');
    if (!boardElement) return null;
    
    const rect = boardElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const cellWidth = rect.width / 7; // 7 columns
    const col = Math.floor(x / cellWidth);
    
    return col >= 0 && col < 7 ? col : null;
  };

  const handleClick = (col) => {
    if (winner || isDraw || !canInteract || droppingCol !== null) return;

    // Clear hover state immediately when drop begins
    setHoverCol(null);
    // CHANGE: Clear touch state when drop begins
    setTouchCol(null);
    clearTouchTimeout();
    setDroppingCol(col);

    // CHANGE: Find target row based on board orientation
    let targetRow = -1;
    if (isUpsideDown) {
      // In upside-down mode, find first empty row from top
      for (let row = 0; row < board.length; row++) {
        if (board[row][col] === "⚪") {
          targetRow = row;
          break;
        }
      }
    } else {
      // Normal mode, find first empty row from bottom
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][col] === "⚪") {
          targetRow = row;
          break;
        }
      }
    }

    if (targetRow === -1) return; // Column is full

    // CHANGE: Adjust falling animation for upside-down mode
    const startRow = isUpsideDown ? board.length : -1;

    // Start falling animation
    setFallingDisc({
      col,
      targetRow,
      currentRow: startRow,
      player: currentPlayer,
    });

    // Animation duration based on distance (more realistic)
    const distance = isUpsideDown ? targetRow + 1 : board.length - targetRow;
    const animationDuration = 300 + distance * 50;

    // CHANGE: Play drop sound earlier - at 30% of animation duration instead of near the end
    setTimeout(() => {
      if (soundManager) {
        soundManager.playDropSound();
      }
    }, animationDuration * 0.1); // Play sound at 30% of animation completion

    setTimeout(() => {
      setFallingDisc(null);
      onDrop(col);
      setDroppingCol(null);
    }, animationDuration);
  };

  const handleMouseEnter = (col) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      setHoverCol(col);
      // Play hover sound
      if (soundManager) {
        soundManager.playHoverSound();
      }
    }
  };

  const handleMouseLeave = () => {
    if (canInteract && droppingCol === null) {
      setHoverCol(null);
    }
  };

  // CHANGE: Add touch start handler for mobile preview
  const handleTouchStart = (col) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      clearTouchTimeout();
      setTouchCol(col);
      // Play hover sound on touch
      if (soundManager) {
        soundManager.playHoverSound();
      }
    }
  };

  // CHANGE: Add touch move handler to track finger sliding across columns
  const handleTouchMove = (e) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const newCol = getColumnFromTouch(touch);
      
      if (newCol !== null && newCol !== touchCol) {
        clearTouchTimeout();
        setTouchCol(newCol);
        // CHANGE: Reduced sound frequency to avoid audio spam during sliding
        if (soundManager && Math.abs(newCol - (touchCol || 0)) === 1) {
          soundManager.playHoverSound();
        }
      }
    }
  };

  // CHANGE: Modified touch end handler to auto-drop piece in highlighted column
  const handleTouchEnd = (e) => {
    if (canInteract && droppingCol === null && touchCol !== null) {
      // Auto-drop the piece in the currently highlighted column
      handleClick(touchCol);
    }
  };

  // CHANGE: Determine which column should show preview/highlight
  const activeCol = hoverCol !== null ? hoverCol : touchCol;

  // Calculate target row for the active column highlight
  let activeTargetRow = -1;
  if (activeCol !== null) {
    if (isUpsideDown) {
      for (let row = 0; row < board.length; row++) {
        if (board[row][activeCol] === "⚪") {
          activeTargetRow = row;
          break;
        }
      }
    } else {
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][activeCol] === "⚪") {
          activeTargetRow = row;
          break;
        }
      }
    }
  }

  // CHANGE: Create CPU falling disc animation when CPU is dropping
  const cpuFallingDisc = isCpuDropping && cpuDroppingCol !== null ? (() => {
    // Find target row for CPU drop
    let targetRow = -1;
    if (isUpsideDown) {
      for (let row = 0; row < board.length; row++) {
        if (board[row][cpuDroppingCol] === "⚪") {
          targetRow = row;
          break;
        }
      }
    } else {
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][cpuDroppingCol] === "⚪") {
          targetRow = row;
          break;
        }
      }
    }
    
    if (targetRow === -1) return null;
    
    const startRow = isUpsideDown ? board.length : -1;
    const distance = isUpsideDown ? targetRow + 1 : board.length - targetRow;
    
    return {
      col: cpuDroppingCol,
      targetRow,
      currentRow: startRow,
      player: "🟡", // CPU player emoji
      // CHANGE: Calculate exact animation duration to match useConnect4CPU timing
      animationDuration: 400 + Math.abs(distance) * 50,
    };
  })() : null;


  return (
    <>
      {/* CHANGE: Conditionally render preview row based on board orientation */}
      {!isUpsideDown && (
        <PreviewRow>
          {Array.from({ length: 7 }).map((_, col) => (
            <div
              key={col}
              className="preview-cell"
              onMouseEnter={() => handleMouseEnter(col)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(col)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => canInteract && handleClick(col)}
            >
              {activeCol === col &&
                canInteract &&
                !winner &&
                !isDraw &&
                droppingCol === null && (
                  <span className="preview-piece">{currentPlayer}</span>
                )}
            </div>
          ))}
        </PreviewRow>
      )}

      <BoardContainer data-board-container>
        {/* Column highlights */}
        {activeCol !== null && droppingCol === null && activeTargetRow !== -1 && (
          <ColumnHighlight
            style={{
              left: `calc(var(--board-padding) + ${activeCol} * (var(--cell) + var(--gap)) - 3px)`,
              ...(isUpsideDown
                ? {
                    top: "auto",
                    bottom: "calc(var(--board-padding) - 3px)",
                    height: `calc(${board.length - 1 - activeTargetRow} * (var(--cell) + var(--gap)) + var(--cell) + 6px)`,
                  }
                : {
                    top: "calc(var(--board-padding) - 3px)",
                    bottom: "auto",
                    height: `calc(${activeTargetRow} * (var(--cell) + var(--gap)) + var(--cell) + 6px)`,
                  }),
              backgroundColor:
                currentPlayer === "🔴"
                  ? "rgba(255, 68, 68, 0.35)"
                  : "rgba(255, 221, 0, 0.35)",
            }}
          />
        )}

        {/* CHANGE: Adjust falling disc animation for upside-down mode */}
        {fallingDisc && (
          <FallingDisc
            style={{
              left: `calc(${fallingDisc.col} * (var(--cell) + var(--gap)) + var(--gap))`,
              animationDuration: `${400 + Math.abs(fallingDisc.targetRow - fallingDisc.currentRow) * 50}ms`,
              "--target-row": fallingDisc.targetRow,
              "--start-row": fallingDisc.currentRow,
              "--is-upside-down": isUpsideDown ? 1 : 0,
            }}
          >
            {fallingDisc.player}
          </FallingDisc>
        )}

        {/* CHANGE: Add CPU falling disc animation with synchronized timing */}
        {cpuFallingDisc && (
          <FallingDisc
            style={{
              left: `calc(${cpuFallingDisc.col} * (var(--cell) + var(--gap)) + var(--gap))`,
              // CHANGE: Use calculated duration from cpuFallingDisc object
              animationDuration: `${cpuFallingDisc.animationDuration}ms`,
              "--target-row": cpuFallingDisc.targetRow,
              "--start-row": cpuFallingDisc.currentRow,
              "--is-upside-down": isUpsideDown ? 1 : 0,
            }}
          >
            {cpuFallingDisc.player}
          </FallingDisc>
        )}


        {/* NEW: Batch falling overlays when restoring normal gravity */}
        {Array.isArray(gravityAnimation) &&
          gravityAnimation.length > 0 &&
          gravityAnimation.map((d, i) => {
            const distance = Math.max(0, d.toRow - d.fromRow);
            const duration = 300 + distance * 70; // keep in sync with planner
            return (
              <FallingDisc
                key={`grav-${i}`}
                style={{
                  left: `calc(${d.col} * (var(--cell) + var(--gap)) + var(--gap))`,
                  animationDuration: `${duration}ms`,
                  animationName: "gravityDrop",
                  "--target-row": d.toRow,
                  "--start-row": d.fromRow,
                }}
              >
                {d.player}
              </FallingDisc>
            );
          })}


        {board.map((row, r) => (
          <Row key={r}>
            {row.map((cell, c) => (
              <Cell
                key={c}
                onClick={() => canInteract && handleClick(c)}
                onMouseEnter={() => handleMouseEnter(c)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchStart(c)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={droppingCol === c ? "dropping" : ""}
                style={{
                  cursor:
                    canInteract && !winner && !isDraw && droppingCol === null
                      ? "pointer"
                      : "default",

                  opacity: droppingCol !== null && droppingCol !== c ? 0.7 : 1,
                }}
              >
                {/* Hide original from-cells while overlay is animating */}
                {maskedKeys && maskedKeys.has(`${r},${c}`) ? "⚪" : cell}

              </Cell>
            ))}
          </Row>
        ))}

        {/* Render a single connecting line if there's a winner and a winning line */}
        {(() => {
          if (!winner || !winningLine || winningLine.length < 4) return null;

          // Find start and end cells by sorting by column then row
          const sorted = [...winningLine].sort((a, b) => a.col - b.col || a.row - b.row);
          const first = sorted[0];
          const last = sorted[sorted.length - 1];

          // Vector from first to last
          const dRow = last.row - first.row;
          const dCol = last.col - first.col;

          // Calculate visual parameters
          const angle = Math.atan2(dRow, dCol) * (180 / Math.PI);
          const distance = Math.sqrt(dRow * dRow + dCol * dCol);
          
          // Center point between the two extreme discs
          const midCol = (first.col + last.col) / 2;
          const midRow = (first.row + last.row) / 2;

          return (
            <WinningLineWrapper
              style={{
                left: `calc(var(--board-padding) + ${midCol} * (var(--cell) + var(--gap)) + var(--cell) / 2)`,
                top: `calc(var(--board-padding) + ${midRow} * (var(--cell) + var(--gap)) + var(--cell) / 2)`,
                width: `calc(${distance} * (var(--cell) + var(--gap)) + var(--cell))`,
                height: "var(--cell)",
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            >
              <WinningLine />
            </WinningLineWrapper>
          );
        })()}

      </BoardContainer>

      {/* CHANGE: Add preview row at bottom for upside-down mode */}
      {isUpsideDown && (
        <PreviewRow style={{ marginTop: "0px", marginBottom: "0px" }}>
          {Array.from({ length: 7 }).map((_, col) => (
            <div
              key={col}
              className="preview-cell"
              onMouseEnter={() => handleMouseEnter(col)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(col)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => canInteract && handleClick(col)}
            >
              {activeCol === col &&
                canInteract &&
                !winner &&
                !isDraw &&
                droppingCol === null && (
                  <span className="preview-piece">{currentPlayer}</span>
                )}
            </div>
          ))}
        </PreviewRow>
      )}
    </>
  );
};

export default Board;
