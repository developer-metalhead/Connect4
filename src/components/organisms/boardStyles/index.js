import { useState,useMemo,useEffect,useRef } from "react";
import {
  BoardContainer,
  Row,
  Cell,
  PreviewRow,
  ColumnHighlight,
  FallingDisc,
  WinningLineWrapper,
  WinningLine,
  GhostDisc,
  ImpactRipple,
  EjectedPiece,
} from "./index.style";
import PoopBlockIndicator from "../../features/ChaosChicken/PoopBlockIndicator";
import { useGameSettings } from "../../../hooks/core/useGameSettings";

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
  isCpuDropping = false,
  cpuDroppingCol = null,
  winningLine = null,
  blockedColumns = [],
  onBlockedColumnAttempt = null,
  PoopBlockIndicatorComponent = PoopBlockIndicator,
}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);
  const [fallingDisc, setFallingDisc] = useState(null);
  const [rippleCell, setRippleCell] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [touchCol, setTouchCol] = useState(null);
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [jigglingCols, setJigglingCols] = useState({});
  const [ejectedPieces, setEjectedPieces] = useState([]);
  const { enableBoardShake, shakeIntensity } = useGameSettings();
  
  const prevBoardRef = useRef(board);

  // CHANGE: Physics-based reset animation detection
  useEffect(() => {
    const isNowEmpty = board.every(row => row.every(cell => cell === "⚪"));
    const wasNotEmpty = prevBoardRef.current && prevBoardRef.current.some(row => row.some(cell => cell !== "⚪"));

    if (isNowEmpty && wasNotEmpty) {
      const newEjected = [];
      prevBoardRef.current.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== "⚪") {
            // Random physics trajectories
            const vx = (Math.random() - 0.5) * 1200; // Wider horizontal spread
            const vy = -(Math.random() * 600 + 400); // Stronger upward pop
            const vr = (Math.random() - 0.5) * 1080; // More rotation for chaos
            
            newEjected.push({
              id: `eject-${r}-${c}-${Math.random()}`,
              row: r,
              col: c,
              player: cell,
              vx,
              vy,
              vr
            });
          }
        });
      });
      
      setEjectedPieces(newEjected);
      // Play a special sound if possible
      if (soundManager) {
        soundManager.playSound('coinsfalling'); // Already added in previous turn
      }
      
      setTimeout(() => setEjectedPieces([]), 1500);
    }
    prevBoardRef.current = board;
  }, [board, soundManager]);

  // Build a quick mask to hide source cells during mass-fall overlays
  const maskedKeys = useMemo(() => {
    if (!Array.isArray(gravityAnimation) || gravityAnimation.length === 0) return null;
    const keys = new Set();
    gravityAnimation.forEach(a => {
      keys.add(`${a.fromRow},${a.col}`);
      keys.add(`${a.toRow},${a.col}`);
    });
    return keys;
  }, [gravityAnimation]);

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

  useEffect(() => {
    return () => clearTouchTimeout();
  }, []);

  // CHANGE: Reset dropping state if the board is completely cleared (game reset)
  useEffect(() => {
    if (board.every(row => row.every(cell => cell === "⚪"))) {
      setDroppingCol(null);
      setFallingDisc(null);
      setHoverCol(null);
      setJigglingCols({});
    }
  }, [board]);

  // CHANGE: Check if column is blocked by poop
  const isColumnBlockedByPoop = (col) => {
    return (blockedColumns || []).some(block => block.columnIndex === col && block.turnsLeft > 0);
  };

  const handleClick = (col) => {
    if (winner || isDraw || !canInteract || droppingCol !== null) return;

    // CHANGE: Handle blocked columns
    if (isColumnBlockedByPoop(col)) {
      const clickedCol = col;
      // Force animation restart by briefly removing the state
      setJigglingCols(prev => ({ ...prev, [clickedCol]: false }));
      
      setTimeout(() => {
        setJigglingCols(prev => ({ ...prev, [clickedCol]: true }));
        if (soundManager) soundManager.playSound("error"); // Will fallback to click or ignore if error.mp3 not found
        
        setTimeout(() => {
          setJigglingCols(prev => ({ ...prev, [clickedCol]: false }));
        }, 400);
      }, 30);

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

    setDroppingCol(col);

    const startRow = isUpsideDown ? board.length : -1;

    setFallingDisc({
      col,
      targetRow,
      currentRow: startRow,
      player: currentPlayer,
    });

    const distance = isUpsideDown ? targetRow + 1 : board.length - targetRow;
    const animationDuration = 550 + distance * 25; // Slightly longer for juicier bounces

    // Impact 1 (50%)
    setTimeout(() => {
      if (soundManager) soundManager.playSound("drop");
      if (enableBoardShake) {
        // Delay shake by 60ms to feel like a reaction
        setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 150);
        }, 60);
      }
      setRippleCell({ row: targetRow, col, player: currentPlayer });
      setTimeout(() => setRippleCell(null), 500); // 500ms duration matches CSS
    }, animationDuration * 0.5);

    // Impact 2 (82%)
    setTimeout(() => {
      if (soundManager) soundManager.playSound("drop");
    }, animationDuration * 0.82);

    // Impact 3 (97% - settle)
    setTimeout(() => {
      if (soundManager) soundManager.playSound("drop");
    }, animationDuration * 0.97);

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


  // Preview row for "ghost" disc
  const previewRow = useMemo(() => {
    if (activeCol === null || winner || isDraw || !canInteract) return null;

    if (isUpsideDown) {
      // Find top-most empty cell
      for (let r = 0; r < 6; r++) {
        if (board[r][activeCol] === "⚪") return r;
      }
    } else {
      // Find bottom-most empty cell
      for (let r = 5; r >= 0; r--) {
        if (board[r][activeCol] === "⚪") return r;
      }
    }
    return null;
  }, [activeCol, board, winner, isDraw, canInteract, isUpsideDown]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                droppingCol === null &&
                !isColumnBlockedByPoop(col) && (
                  <span className="preview-piece">{currentPlayer}</span>
                )}
            </div>
          ))}
        </PreviewRow>
      )}

      <BoardContainer 
        data-board-container 
        className={isShaking ? "board-shake" : ""}
        style={{ "--shake-amount": `${shakeIntensity * 0.4}px` }}
      >
        {/* CHANGE: Add poop block indicators */}
        {(blockedColumns || []).map((block) => (
          <PoopBlockIndicatorComponent
            key={`poop-${block.columnIndex}`}
            columnIndex={block.columnIndex}
            turnsLeft={block.turnsLeft}
          />
        ))}

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

        {fallingDisc && (
          <FallingDisc
            style={{
              left: `calc(var(--board-padding) + ${fallingDisc.col} * (var(--cell) + var(--gap)))`,
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
              left: `calc(var(--board-padding) + ${cpuFallingDisc.col} * (var(--cell) + var(--gap)))`,
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


        {Array.isArray(gravityAnimation) &&
          gravityAnimation.length > 0 &&
          gravityAnimation.map((d, i) => {
            const distance = Math.abs(d.toRow - d.fromRow);
            const duration = 400 + distance * 120; // Slower, more premium fall
            return (
              <FallingDisc
                key={`grav-${i}`}
                style={{
                  left: `calc(var(--board-padding) + ${d.col} * (var(--cell) + var(--gap)))`,
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

        {/* Physics-based ejection pieces */}
        {ejectedPieces.map((p) => (
          <EjectedPiece
            key={p.id}
            style={{
              left: `calc(var(--board-padding) + ${p.col} * (var(--cell) + var(--gap)))`,
              top: `calc(var(--board-padding) + ${p.row} * (var(--cell) + var(--gap)))`,
              "--vx": `${p.vx}px`,
              "--vy": `${p.vy}px`,
              "--vr": `${p.vr}deg`,
              "--is-upside-down": isUpsideDown ? 1 : 0,
            }}
          >
            {p.player}
          </EjectedPiece>
        ))}

        {board.map((row, r) => (
          <Row key={r}>
            {row.map((cell, c) => {
              // Calculate win state classes
              const isWinningPiece = winner && winningLine && winningLine.some(loc => loc.row === r && loc.col === c);
              const isLosingPiece = winner && !isWinningPiece && cell !== "⚪";

              return (
                <Cell
                  key={c}
                onClick={() => canInteract && handleClick(c)}
                onMouseEnter={() => handleMouseEnter(c)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchStart(c)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                  ${droppingCol === c ? "dropping" : ""} 
                  ${activeCol === c && activeTargetRow === r && droppingCol === null ? "target-glow" : ""} 
                  ${jigglingCols[c] ? "jiggle" : ""}
                  ${isWinningPiece ? "winning-piece" : ""}
                  ${isLosingPiece ? "losing-piece" : ""}
                `}
                style={{
                  cursor:
                    canInteract && !winner && !isDraw && droppingCol === null
                      ? isColumnBlockedByPoop(c) ? "not-allowed" : "pointer"
                      : "default",
                  opacity: droppingCol !== null && droppingCol !== c ? 0.7 : 1,
                  // CHANGE: Visual indication for blocked columns
                  filter: isColumnBlockedByPoop(c) ? "grayscale(0.5) brightness(0.8)" : "none",
                  "--target-glow-color": currentPlayer === "🔴" ? "rgba(255, 68, 68, 0.8)" : "rgba(255, 221, 0, 0.8)",
                }}
              >
                {/* Hide original from-cells while overlay is animating */}
                {maskedKeys && maskedKeys.has(`${r},${c}`) ? "⚪" : cell}

                {/* Ghost Preview Disc */}
                {previewRow === r && activeCol === c && (
                  <GhostDisc>{currentPlayer}</GhostDisc>
                )}

                {/* Impact Ripple Burst */}
                {rippleCell && rippleCell.row === r && rippleCell.col === c && (
                  <ImpactRipple 
                    style={{ 
                      "--ripple-color": rippleCell.player === "🔴" ? "rgba(255, 68, 68, 0.8)" : "rgba(255, 221, 0, 0.8)" 
                    }} 
                  />
                  )}
                </Cell>
              );
            })}
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
                droppingCol === null &&
                !isColumnBlockedByPoop(col) && (
                  <span className="preview-piece">{currentPlayer}</span>
                )}
            </div>
          ))}
        </PreviewRow>
      )}
    </div>
  );
};

export default Board;
