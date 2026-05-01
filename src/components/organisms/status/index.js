import { styled } from "@mui/material/styles";

const StatusWrapper = styled("div")({
  fontSize: "clamp(18px, 4vw, 28px)",
  fontWeight: "600",
  textAlign: "center",
  margin: "clamp(8px, 2vh, 20px) 0",
  minHeight: "clamp(40px, 8vh, 60px)",
  padding: "0 16px",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    fontSize: "clamp(16px, 3.5vw, 20px)",
    margin: "clamp(4px, 1vh, 8px) 0",
    minHeight: "clamp(32px, 6vh, 40px)",
    padding: "0 8px",
  },
});


const coinColor = (coin) =>
  coin === "🔴" ? "#ff4444" : coin === "🟡" ? "#ffdd00" : "#ddd";

const Status = ({ winner, isDraw, currentPlayer, playerNames = {} }) => {
  const currentName = playerNames[currentPlayer];
  const winnerName = playerNames[winner];

  if (winner) {
    return (
      <StatusWrapper aria-live="polite">
        🎉 <span style={{ color: coinColor(winner) }}>{winner}</span>
        {winnerName ? ` (${winnerName})` : ""} Wins! 🎉
      </StatusWrapper>
    );
  }

  if (isDraw) {
    return <StatusWrapper aria-live="polite">🤝 It's a Draw!</StatusWrapper>;
  }

  return (
    <StatusWrapper aria-live="polite">
      Current Turn:{" "}
      <span
        style={{
          fontSize: "clamp(20px, 5vw, 32px)",
          paddingLeft: "4px",
          color: coinColor(currentPlayer),
          // Mobile optimization for emoji size
          "@media (max-width: 480px)": {
            fontSize: "clamp(18px, 4.5vw, 24px)",
          },
        }}
      >
        {currentPlayer}
      </span>
      {currentName ? (
        <span 
          style={{ 
            paddingLeft: 6,
            fontSize: "clamp(14px, 3vw, 18px)",
          }}
        >
          ({currentName})
        </span>
      ) : null}

    </StatusWrapper>
  );
};

export default Status;
