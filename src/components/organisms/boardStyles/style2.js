/* eslint-disable no-unused-vars */
import styled from "styled-components";

export const BoardContainer = styled("div")({
  // Fluid sizing across devices
  "--cell": "clamp(34px, 9vmin, 50px)",
  "--gap": "clamp(6px, 2vmin, 12px)",
  "--board-padding": "clamp(8px, 2.5vmin, 16px)",

  display: "inline-flex",
  flexDirection: "column",
  backgroundColor: "#003366", // Classic Connect 4 blue
  padding: "var(--board-padding)",
  borderRadius: "16px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.1)",
  position: "relative",
  userSelect: "none",
  gap: "var(--gap)",
  border: "4px solid #002244",
});

export const Row = styled("div")({
  display: "flex",
  gap: "var(--gap)",
});

export const Cell = styled("div")({
  width: "var(--cell)",
  height: "var(--cell)",
  backgroundColor: "#1e90ff", // Lighter blue for the "holes"
  borderRadius: "50%",
  boxShadow: "inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(var(--cell) * 0.75)",
  position: "relative",
  transition: "transform 0.15s ease, background 0.15s ease, opacity 0.15s ease",

  "&.dropping": {
    transform: "scale(1.02)",
    backgroundColor: "#2e9bff",
  },
});

export const PreviewRow = styled("div")({
  display: "flex",
  gap: "var(--gap)",
  marginBottom: "12px",
  padding: "0 var(--board-padding)",
  justifyContent: "center",

  "& .preview-cell": {
    width: "var(--cell)",
    height: "var(--cell)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(var(--cell) * 0.75)",
    cursor: "pointer",
    transition: "transform 0.2s ease, opacity 0.2s ease",
    borderRadius: "50%",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
      transform: "scale(1.1)",
    },
  },
});

export const StatusContainer = styled("div")({
  marginTop: "24px",
  padding: "16px 32px",
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: "20px",
  fontWeight: "600",
  textAlign: "center",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
});

export const PlayerIndicator = styled("span")(({ color }) => ({
  display: "inline-block",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: color === "red" ? "#ff4d4d" : "#ffcc00",
  marginRight: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
}));

export const ResetButton = styled("button")({
  marginTop: "20px",
  padding: "12px 28px",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
  cursor: "pointer",
  backgroundColor: "#ff6b6b",
  color: "white",
  border: "none",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 14px rgba(255, 107, 107, 0.4)",

  "&:hover": {
    backgroundColor: "#ff5252",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(255, 107, 107, 0.6)",
  },

  "&:active": {
    transform: "translateY(0)",
  },
});

export const ColumnHighlight = styled("div")({
  position: "absolute",
  width: "calc(var(--cell) + 6px)",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  borderRadius: "999px", // Pill shape
  pointerEvents: "none",
  zIndex: 1,
  transition: "left 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), height 0.25s ease, top 0.25s ease",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(2px)",
});

export const FallingDisc = styled("div")({
  position: "absolute",
  width: "var(--cell)",
  height: "var(--cell)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(var(--cell) * 0.75)",
  pointerEvents: "none",
  zIndex: 10,
  animation: "discFall ease-in forwards",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  // CHANGE: Disable text selection for falling discs
  userSelect: "none",
  WebkitUserSelect: "none",
});

export const WinningLineWrapper = styled("div")({
  position: "absolute",
  zIndex: 100,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transformOrigin: "center center",
});

export const WinningLine = styled("div")({
  width: "100%",
  height: "100%",
  borderRadius: "999px",
  border: "4px solid #ffffff",
  boxShadow: "0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)",
  boxSizing: "border-box",
  animation: "highlightPulse 1.5s infinite ease-in-out",
});

export const GhostDisc = styled("span")({
  position: "absolute",
  opacity: 0.5,
  userSelect: "none",
  pointerEvents: "none",
  fontSize: "inherit",
  animation: "ghostPulse 2s infinite ease-in-out",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
});

// CHANGE: Updated keyframes to handle both normal and upside-down falling
export const GlobalStyles = `
  @keyframes discFall {
    0% {
      transform: translateY(calc(var(--start-row, -1) * (var(--cell) + var(--gap)) - 80px));
      opacity: 1;
    }
    85% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) + 10px * (var(--is-upside-down, 0) * 2 - 1)));
    }
    95% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 5px * (var(--is-upside-down, 0) * 2 - 1)));
    }
    100% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      opacity: 0;
    }
  }

  /* NEW: Mass gravity-restore animation (no initial -80px jump) */
  @keyframes gravityDrop {
    0% {
      transform: translateY(calc(var(--start-row) * (var(--cell) + var(--gap))));
      opacity: 1;
    }
    85% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) + 10px));
    }
    95% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 5px));
    }
    100% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      opacity: 0;
    }
  }

  @keyframes ghostPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.6; }
  }

  @keyframes highlightPulse {
    0% {
      transform: scale(1.0);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.9);
    }
    100% {
      transform: scale(1.0);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
    }
  }
`;
