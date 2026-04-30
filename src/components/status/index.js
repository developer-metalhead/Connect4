import { styled } from "@mui/material/styles";

const StatusWrapper = styled("div")({
  fontSize: "28px",
  fontWeight: "600",
  textAlign: "center",
  margin: "20px 0",
  minHeight: "60px",
});

const Status = ({ winner, isDraw, currentPlayer }) => {
  if (winner) {
    return (
      <StatusWrapper>
        🎉{" "}
        <span style={{ color: winner === "🔴" ? "#ff4444" : "#ffdd00" }}>
          {winner}
        </span>{" "}
        Wins! 🎉
      </StatusWrapper>
    );
  }

  if (isDraw) {
    return <StatusWrapper>🤝 It's a Draw!</StatusWrapper>;
  }

  return (
    <StatusWrapper>
      Current Turn :{" "}
      <span style={{ fontSize: "32px", paddingLeft: "2px" }}>
        {currentPlayer}
      </span>
    </StatusWrapper>
  );
};

export default Status;
