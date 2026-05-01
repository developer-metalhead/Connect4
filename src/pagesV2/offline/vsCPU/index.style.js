import { styled } from "@mui/material/styles";
import { tokens } from "../../../components/designSystem/tokens";

export const GameLayout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",

  "@media (max-width: 768px)": {
    gap: "12px", // Tighten gaps for mobile
  }
});

export const ControlGroup = styled("div")({
  display: "flex",
  gap: "12px",
  marginTop: "16px",
  width: "100%",
  maxWidth: "320px",
  justifyContent: "center",
});