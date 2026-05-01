import { styled } from "@mui/material/styles";

export const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: "24px",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    padding: "8px",
    gap: "12px",
  },
});


export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  fontSize: "64px",
  padding: "16px",
  gap: "24px",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    fontSize: "32px",
    padding: "8px",
    gap: "8px",
  },
});


export const BodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  color: "#FFFFFF73",
  fontSize: "24px",
  padding: "16px",
  gap: "24px",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    fontSize: "16px",
    padding: "8px",
    gap: "8px",
  },
});


export const PageContainer = styled("div")({
  background: "#0f0f0f",
  gap: "clamp(12px, 3vw, 18px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
  minHeight: "100dvh",
  width: "100%",
  padding: "clamp(12px, 3vw, 24px)",
  margin: 0,
  overflowX: "hidden",
  boxSizing: "border-box",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    gap: "8px",
    padding: "8px",
    minHeight: "100vh",
  },
});

