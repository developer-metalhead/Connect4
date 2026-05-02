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
  position: "relative",
  // Layout isolation for mobile perf
  contain: "layout style",
  // CHANGE: Disable text selection and touch callouts for game board
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  WebkitTouchCallout: "none",
  WebkitTapHighlightColor: "transparent",

  // "&.board-shake": {
  //   animation: "boardShake 0.15s ease-out",
  // },
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
  // GPU-composited transitions only (transform + opacity)
  transition: "transform 0.12s ease, opacity 0.12s ease",
  boxShadow: "inset 0 6px 12px rgba(0,0,0,0.4)",
  // Hint GPU to prepare this layer
  willChange: "transform, opacity",
  // CHANGE: Disable text selection and touch callouts for game cells
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  WebkitTouchCallout: "none",
  WebkitTapHighlightColor: "transparent",
  position: "relative",

  "&:hover": {
    transform: "scale(1.06)",
  },

  "&.target-glow::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    backgroundColor: "var(--target-glow-color, rgba(255, 255, 255, 0.4))",
    pointerEvents: "none",
    zIndex: 10,
    animation: "ghostPulse 1.2s infinite alternate",
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
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    WebkitTapHighlightColor: "transparent",
  },

  "& .preview-piece": {
    fontSize: "clamp(34px, 9vmin, 40px)",
    opacity: 0.6,
    // GPU-composited transitions for smooth sliding
    transition: "transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.12s ease",
    willChange: "transform, opacity",
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
  // GPU-composited transition: use transform for horizontal movement
  transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), height 0.1s cubic-bezier(0.4, 0, 0.2, 1), top 0.1s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.1s cubic-bezier(0.4, 0, 0.2, 1), left 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
  willChange: "transform, height, left",
  zIndex: 1,
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
  // GPU layer promotion for smooth animation
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
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
  opacity: 0.6,
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

export const ImpactRipple = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  boxSizing: "border-box",
  border: "4px solid var(--ripple-color, #ffffff)",
  animation: "rippleOut 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
  pointerEvents: "none",
  zIndex: 15,
});


// CHANGE: Updated keyframes to handle both normal and upside-down falling
export const GlobalStyles = `
  @keyframes discFall {
    0% {
      transform: translateY(calc(var(--start-row, -1) * (var(--cell) + var(--gap)) - 80px * (1 - var(--is-upside-down, 0) * 2)));
      opacity: 1;
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); /* ease-in (accelerating fall) */
    }
    50% {
      /* First impact */
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* ease-out (decelerating upward bounce) */
    }
    68% {
      /* Peak of 1st bounce (highest) */
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 48px * (1 - var(--is-upside-down, 0) * 2)));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); /* ease-in (accelerating fall) */
    }
    82% {
      /* Second impact */
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* ease-out (decelerating upward bounce) */
    }
    91% {
      /* Peak of 2nd bounce (smaller) */
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 22px * (1 - var(--is-upside-down, 0) * 2)));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); /* ease-in (accelerating fall) */
    }
    97% {
      /* Third impact (settle) */
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* ease-out (very tiny bounce) */
    }
    98.5% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 5px * (1 - var(--is-upside-down, 0) * 2)));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); /* ease-in down */
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
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    50% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    68% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 48px));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    82% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    91% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 22px));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    97% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    98.5% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap)) - 5px));
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    100% {
      transform: translateY(calc(var(--target-row) * (var(--cell) + var(--gap))));
      opacity: 0;
    }
  }

  @keyframes highlightPulse {
    0% {
      transform: scale(1.08);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
    }
    50% {
      transform: scale(1.12);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
    }
    100% {
      transform: scale(1.08);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
    }
  }

  @keyframes ghostPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.6; }
  }

  @keyframes rippleOut {
    0% { 
      transform: scale(0.8); 
      opacity: 0.8; 
      border-width: 6px; 
    }
    100% { 
      transform: scale(2); 
      opacity: 0; 
      border-width: 0px; 
    }
  }

  @keyframes boardShake {
    0% { transform: translateY(0); }
    25% { transform: translateY(2px); }
    75% { transform: translateY(-1px); }
    100% { transform: translateY(0); }
  }
`;
