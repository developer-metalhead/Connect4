import { styled } from "@mui/material/styles";

const StatusWrapper = styled("div")({
  fontSize: "28px",
  fontWeight: "600",
  textAlign: "center",
  margin: "20px 0",
  minHeight: "60px",
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
          fontSize: "32px",
          paddingLeft: "4px",
          color: coinColor(currentPlayer),
        }}
      >
        {currentPlayer}
      </span>
      {currentName ? (
        <span style={{ paddingLeft: 6 }}>({currentName})</span>
      ) : null}
    </StatusWrapper>
  );
};

export default Status;
