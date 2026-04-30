import { styled } from "@mui/material/styles";

export const BoardContainer = styled("div")({
  // Fluid sizing across devices
  "--cell": "clamp(34px, 9vmin, 64px)",
  "--gap": "clamp(6px, 2vmin, 12px)",

  background: "#0a1f45",
  padding: "clamp(8px, 2.5vmin, 16px)",
  borderRadius: "16px",
  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.5)",
  display: "inline-block",
  maxWidth: "100%",
});

export const Row = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, var(--cell))",
  gap: "var(--gap)",
  justifyContent: "center",
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
  cursor: "pointer",
  transition: "transform 0.15s ease, background 0.15s ease, opacity 0.15s ease",
  boxShadow: "inset 0 6px 12px rgba(0,0,0,0.4)",

  "&:hover": {
    background: "#4fc3f7",
    transform: "scale(1.06)",
  },

  "&.dropping": {
    animation: "fall 0.35s ease-in",
  },
});

export const PreviewRow = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, 75px)",
  gap: "10px",
  height: "55px",
  marginBottom: "0px",
  justifyContent: "center",

  "& .preview-cell": {
    width: "75px",
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  "& .preview-piece": {
    fontSize: "40px",
    opacity: 0.6,
    transition: "all 0.2s",
  },
});

// Global Keyframes
export const GlobalStyles = `
  @keyframes fall {
    0% {
      transform: translateY(-350px);
      opacity: 0;
    }
    70% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
