import { useState } from "react";
import { BoardContainer, Row, Cell, PreviewRow } from "./index.style"; // Make sure path is correct

const Board = ({
  board,
  currentPlayer,
  winner,
  isDraw,
  onDrop,
  canInteract = true,
}) => {
  const [hoverCol, setHoverCol] = useState(null);
  const [droppingCol, setDroppingCol] = useState(null);

  const handleClick = (col) => {
    if (winner || isDraw || !canInteract) return;

    setDroppingCol(col);

    setTimeout(() => {
      onDrop(col);
      setDroppingCol(null);
    }, 400);
  };

  return (
    <>
      <PreviewRow>
        {Array.from({ length: 7 }).map((_, col) => (
          <div
            key={col}
            className="preview-cell"
            onMouseEnter={() => canInteract && setHoverCol(col)}
            onMouseLeave={() => canInteract && setHoverCol(null)}
            onClick={() => canInteract && handleClick(col)}
          >
            {hoverCol === col && canInteract && !winner && !isDraw && (
              <span className="preview-piece">{currentPlayer}</span>
            )}
          </div>
        ))}
      </PreviewRow>

      <BoardContainer>
        {board.map((row, r) => (
          <Row key={r}>
            {row.map((cell, c) => (
              <Cell
                key={c}
                onClick={() => canInteract && handleClick(c)}
                onMouseEnter={() => canInteract && setHoverCol(c)}
                onMouseLeave={() => canInteract && setHoverCol(null)}
                className={droppingCol === c ? "dropping" : ""}
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
