import { useState } from "react";
import {
  BoardContainer,
  Row,
  Cell,
  PreviewRow,
  ColumnHighlight,
  FallingDisc,
} from "./index.style";
import PoopBlockIndicator from "../../features/ChaosChicken/PoopBlockIndicator";

const Board = ({
  board,
  currentPlayer,
  winner,
  isDraw,
  onDrop,
  canInteract = true,
  soundManager,
  isUpsideDown = false,
  gravityAnimation = null,
  // CHANGE: Add Chaos Chicken props
  blockedColumns = [],
  onBlockedColumnAttempt,
}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);
  const [fallingDisc, setFallingDisc] = useState(null);
  const [touchCol, setTouchCol] = useState(null);
  const [touchTimeout, setTouchTimeout] = useState(null);

  // Build a quick mask to hide source cells during mass-fall overlays
  const maskedKeys =
    Array.isArray(gravityAnimation) && gravityAnimation.length > 0
      ? new Set(gravityAnimation.map((a) => `${a.fromRow},${a.col}`))
      : null;

  const clearTouchTimeout = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
  };

  const getColumnFromTouch = (touch) => {
    const boardElement = document.querySelector('[data-board-container]');
    if (!boardElement) return null;
    
    const rect = boardElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const cellWidth = rect.width / 7;
    const col = Math.floor(x / cellWidth);
    
    return col >= 0 && col < 7 ? col : null;
  };

  // CHANGE: Check if column is blocked by poop
  const isColumnBlockedByPoop = (col) => {
    return blockedColumns.some(block => block.columnIndex === col && block.turnsLeft > 0);
  };

  const handleClick = (col) => {
    if (winner || isDraw || !canInteract || droppingCol !== null) return;

    // CHANGE: Handle blocked columns
    if (isColumnBlockedByPoop(col)) {
      console.log("💩 ATTEMPTED DROP ON BLOCKED COLUMN:", col);
      if (onBlockedColumnAttempt) {
        const redirectCol = onBlockedColumnAttempt(col);
        if (redirectCol !== -1 && redirectCol !== col) {
          console.log("🔄 REDIRECTING TO COLUMN:", redirectCol);
          col = redirectCol;
        } else {
          console.log("❌ NO ALTERNATIVE COLUMN AVAILABLE");
          return;
        }
      } else {
        return;
      }
    }

    // Clear hover state immediately when drop begins
    setHoverCol(null);
    setTouchCol(null);
    clearTouchTimeout();
    setDroppingCol(col);

    // Find target row based on board orientation
    let targetRow = -1;
    if (isUpsideDown) {
      for (let row = 0; row < board.length; row++) {
        if (board[row][col] === "⚪") {
          targetRow = row;
          break;
        }
      }
    } else {
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][col] === "⚪") {
          targetRow = row;
          break;
        }
      }
    }

    if (targetRow === -1) return;

    const startRow = isUpsideDown ? board.length : -1;

    setFallingDisc({
      col,
      targetRow,
      currentRow: startRow,
      player: currentPlayer,
    });

    const distance = isUpsideDown ? targetRow + 1 : board.length - targetRow;
    const animationDuration = 300 + distance * 50;

    setTimeout(() => {
      if (soundManager) {
        soundManager.playDropSound();
      }
    }, animationDuration * 0.1);

    setTimeout(() => {
      setFallingDisc(null);
      onDrop(col);
      setDroppingCol(null);
    }, animationDuration);
  };

  const handleMouseEnter = (col) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      // CHANGE: Show different hover state for blocked columns
      if (isColumnBlockedByPoop(col)) {
        setHoverCol(null); // Don't highlight blocked columns
        return;
      }
      
      setHoverCol(col);
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

  const handleTouchStart = (col) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      clearTouchTimeout();
      
      // CHANGE: Don't highlight blocked columns on touch
      if (isColumnBlockedByPoop(col)) {
        setTouchCol(null);
        return;
      }
      
      setTouchCol(col);
      if (soundManager) {
        soundManager.playHoverSound();
      }
    }
  };

  const handleTouchMove = (e) => {
    if (canInteract && !winner && !isDraw && droppingCol === null) {
      e.preventDefault();
      const touch = e.touches[0];
      const newCol = getColumnFromTouch(touch);
      
      if (newCol !== null && newCol !== touchCol) {
        clearTouchTimeout();
        
        // CHANGE: Don't highlight blocked columns
        if (isColumnBlockedByPoop(newCol)) {
          setTouchCol(null);
          return;
        }
        
        setTouchCol(newCol);
        if (soundManager && Math.abs(newCol - (touchCol || 0)) === 1) {
          soundManager.playHoverSound();
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (canInteract && droppingCol === null && touchCol !== null) {
      handleClick(touchCol);
    }
  };

  const activeCol = hoverCol !== null ? hoverCol : touchCol;

  return (
    <>
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
                droppingCol === null &&
                !isColumnBlockedByPoop(col) && (
                  <span className="preview-piece">{currentPlayer}</span>
                )}
            </div>
          ))}
        </PreviewRow>
      )}

      <BoardContainer data-board-container>
        {/* CHANGE: Add poop block indicators */}
        {blockedColumns.map((block) => (
          <PoopBlockIndicator
            key={`poop-${block.columnIndex}`}
            columnIndex={block.columnIndex}
            turnsLeft={block.turnsLeft}
          />
        ))}

        {/* Column highlights */}
        {activeCol !== null && droppingCol === null && !isColumnBlockedByPoop(activeCol) && (
          <ColumnHighlight
            style={{
              left: `calc(${activeCol} * (var(--cell) + var(--gap)) + var(--gap))`,
              backgroundColor:
                currentPlayer === "🔴"
                  ? "rgba(255, 68, 68, 0.35)"
                  : "rgba(255, 221, 0, 0.35)",
            }}
          />
        )}

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

        {Array.isArray(gravityAnimation) &&
          gravityAnimation.length > 0 &&
          gravityAnimation.map((d, i) => {
            const distance = Math.max(0, d.toRow - d.fromRow);
            const duration = 300 + distance * 70;
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
                    canInteract && !winner && !isDraw && droppingCol === null && !isColumnBlockedByPoop(c)
                      ? "pointer"
                      : "default",
                  opacity: droppingCol !== null && droppingCol !== c ? 0.7 : 1,
                  // CHANGE: Visual indication for blocked columns
                  filter: isColumnBlockedByPoop(c) ? "grayscale(0.5) brightness(0.8)" : "none",
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
              onTouchStart={() => handleTouchStart(col)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => canInteract && handleClick(col)}
            >
              {activeCol === col &&
                canInteract &&
                !winner &&
                !isDraw &&
                droppingCol === null &&
                !isColumnBlockedByPoop(col) && (
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