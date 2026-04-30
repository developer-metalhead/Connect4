import { styled } from "@mui/material/styles";

export const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column",

  padding: "16px",
  gap: "24px",
});

export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  fontSize: "64px",
  padding: "16px",
  gap: "24px",
});

export const BodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  color: "#FFFFFF73",
  fontSize: "24px",
  padding: "16px",
  gap: "24px",
});

export const PageContainer = styled("div")({
  background: "#0f0f0f",
  gap: "24px",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  color: "#fff",

  minHeight: "100vh",
  width: "100vw",

  margin: 0,
  overflow: "hidden", // Fixed: "none" → "hidden"
  boxSizing: "border-box",
});
