import { useState } from "react";
import {
  BoardContainer,
  Row,
  Cell,
  PreviewRow,
  ColumnHighlight,
  FallingDisc,
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

}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);
  const [fallingDisc, setFallingDisc] = useState(null);

  // Build a quick mask to hide source cells during mass-fall overlays
  const maskedKeys =
    Array.isArray(gravityAnimation) && gravityAnimation.length > 0
      ? new Set(gravityAnimation.map((a) => `${a.fromRow},${a.col}`))
      : null;


  const handleClick = (col) => {
    if (winner || isDraw || !canInteract || droppingCol !== null) return;

    // Clear hover state immediately when drop begins
    setHoverCol(null);
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
              onClick={() => canInteract && handleClick(col)}
            >
              {hoverCol === col &&
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

      <BoardContainer>
        {/* Column highlights */}
        {hoverCol !== null && droppingCol === null && (
          <ColumnHighlight
            style={{
              left: `calc(${hoverCol} * (var(--cell) + var(--gap)) + var(--gap))`,
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
              onClick={() => canInteract && handleClick(col)}
            >
              {hoverCol === col &&
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
