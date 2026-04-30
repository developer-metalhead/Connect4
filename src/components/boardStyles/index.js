import { styled } from "@mui/material/styles";

export const StatusContainer = styled("div")({
  fontSize: "28px",
  fontWeight: "600",
  textAlign: "center",
  margin: "20px 0",
  minHeight: "50px",
});

export const BoardContainer = styled("div")({
  background: "#0a1f45",
  padding: "16px",
  borderRadius: "20px",
  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
  display: "inline-grid",
  gridTemplateRows: "repeat(6, 75px)",
  gap: "10px",
});

export const Row = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, 75px)",
  gap: "10px",
});

export const Cell = styled("div")({
  width: "75px",
  height: "75px",
  background: "#1e90ff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "55px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "inset 0 6px 12px rgba(0,0,0,0.4)",

  "&:hover": {
    background: "#4fc3f7",
    transform: "scale(1.08)",
  },
});
