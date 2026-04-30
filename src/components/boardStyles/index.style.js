import { styled } from "@mui/material/styles";

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

  // Drop Animation
  "&.dropping": {
    animation: "fall 0.35s ease-in",
  },
});

export const PreviewRow = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(7, 75px)",
  gap: "10px",
  height: "90px",
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
    fontSize: "48px",
    opacity: 0.6,
    transition: "all 0.2s",
  },
});

// Add this at the bottom of the file (Global Keyframes)
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
