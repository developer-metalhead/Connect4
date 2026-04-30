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
}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);
  const [fallingDisc, setFallingDisc] = useState(null);

  const handleClick = (col) => {
    if (winner || isDraw || !canInteract || droppingCol !== null) return;

    // Clear hover state immediately when drop begins
    setHoverCol(null);
    setDroppingCol(col);

    // Find the target row for the falling disc
    let targetRow = -1;
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === "⚪") {
        targetRow = row;
        break;
      }
    }

    if (targetRow === -1) return; // Column is full

    // Start falling animation
    setFallingDisc({
      col,
      targetRow,
      currentRow: -1, // Start above the board
      player: currentPlayer,
    });

    // Animation duration based on distance (more realistic)
    const animationDuration = 400 + targetRow * 50;

    // Play drop sound at the end of animation for better timing
    setTimeout(() => {
      if (soundManager) {
        soundManager.playDropSound();
      }
    }, animationDuration - 100); // Slightly before animation ends

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

        {/* Falling disc animation */}
        {fallingDisc && (
          <FallingDisc
            style={{
              left: `calc(${fallingDisc.col} * (var(--cell) + var(--gap)) + var(--gap))`,
              animationDuration: `${400 + fallingDisc.targetRow * 50}ms`,
              "--target-row": fallingDisc.targetRow,
            }}
          >
            {fallingDisc.player}
          </FallingDisc>
        )}

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
                {cell}
              </Cell>
            ))}
          </Row>
        ))}
      </BoardContainer>
    </>
  );
};

export default Board;
