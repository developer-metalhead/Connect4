import { styled } from "@mui/material/styles";

export const BoardContainer = styled("div")({
  // Fluid sizing across devices
  "--cell": "clamp(34px, 9vmin, 50px)",
  "--gap": "clamp(6px, 2vmin, 12px)",
  "--board-padding": "clamp(8px, 2.5vmin, 16px)",

  background: "#0a1f45",
  padding: "var(--board-padding)",
  borderRadius: "16px",
  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.5)",
  display: "inline-flex",
  flexDirection: "column",
  gap: "var(--gap)",
  maxWidth: "100%",
  position: "relative", // For absolute positioning of highlights and falling discs
  // CHANGE: Disable text selection and touch callouts for game board
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  WebkitTouchCallout: "none",
  WebkitTapHighlightColor: "transparent",
});

export const Row = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, var(--cell))",
  gap: "var(--gap)",
  justifyContent: "center",
  // CHANGE: Disable text selection for board rows
  userSelect: "none",
  WebkitUserSelect: "none",
});

export const Cell = styled("div")({
  width: "var(--cell)",
  height: "var(--cell)",
  background: "#1e90ff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(var(--cell) * 0.72)",
  transition: "transform 0.15s ease, background 0.15s ease, opacity 0.15s ease",
  boxShadow: "inset 0 6px 12px rgba(0,0,0,0.4)",
  // CHANGE: Disable text selection and touch callouts for game cells
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  WebkitTouchCallout: "none",
  WebkitTapHighlightColor: "transparent",

  "&:hover": {
    background: "#4fc3f7",
    transform: "scale(1.06)",
  },
});

// CHANGE: Use same CSS variables as BoardContainer for perfect alignment and proper sizing
export const PreviewRow = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, 50px)",
  gap: "10px",
  height: "55px",
  marginBottom: "0px",
  justifyContent: "center",

  // CHANGE: Disable text selection for preview row
  userSelect: "none",
  WebkitUserSelect: "none",

  "& .preview-cell": {
    width: "var(--cell)",
    height: "var(--cell)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    // CHANGE: Disable text selection and touch callouts for preview cells
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    WebkitTapHighlightColor: "transparent",
  },

  "& .preview-piece": {
    fontSize: "clamp(34px, 9vmin, 40px)",
    opacity: 0.6,
    transition: "all 0.2s",
    // CHANGE: Disable text selection for preview pieces
    userSelect: "none",
    WebkitUserSelect: "none",
  },

  // CHANGE: Mobile optimization for 1080x2400 screens
"@media (max-width: 480px) and (max-height: 2400px)": {
  height: "clamp(35px, 8vmin, 55px)",
  marginBottom: "0px",
 
  gridTemplateColumns: "repeat(7, 32px)",

  "& .preview-piece": {
    fontSize: "clamp(20px, 6vmin, 28px)",
  },

  "& .preview-cell": {
    width: "clamp(20px, 6vmin, 28px)",
    height: "clamp(20px, 6vmin, 28px)",
  },
},
});


export const ColumnHighlight = styled("div")({
  position: "absolute",
  width: "calc(var(--cell) + 6px)",
  borderRadius: "999px",
  pointerEvents: "none",
  // CHANGE: Faster and smoother transition for column highlight sliding
  transition: "left 0.15s cubic-bezier(0.4, 0, 0.2, 1), height 0.15s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1,
  // CHANGE: Disable text selection for column highlights
  userSelect: "none",
  WebkitUserSelect: "none",
});

export const FallingDisc = styled("div")({
  position: "absolute",
  top: "clamp(8px, 2.5vmin, 16px)",
  width: "var(--cell)",
  height: "var(--cell)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(var(--cell) * 0.72)",
  pointerEvents: "none",
  zIndex: 10,
  animation: "discFall ease-in forwards",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  // CHANGE: Disable text selection for falling discs
  userSelect: "none",
  WebkitUserSelect: "none",
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
`;