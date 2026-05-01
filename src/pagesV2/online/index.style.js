import { styled } from "@mui/material/styles";

export const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  gap: "16px",
  width: "100%",
  maxWidth: "400px",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    padding: "8px",
    gap: "8px",
    maxWidth: "90%",
  },
});

export const HeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  fontSize: "clamp(32px, 8vw, 64px)",
  padding: "16px",
  textAlign: "center",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    fontSize: "clamp(24px, 6vw, 32px)",
    padding: "8px",
  },
});

export const HeaderContainerNotInRoom = styled("div")({
  display: "flex",
  flexDirection: "column",
  fontSize: "clamp(32px, 8vw, 64px)",
  padding: "16px",
  textAlign: "center",
  
 
});

export const BodyContainerNotInRoom = styled("div")({
  display: "flex",
  flexDirection: "column",
  color: "#FFFFFF73",
  fontSize: "clamp(16px, 4vw, 24px)",
  padding: "8px",
  textAlign: "center",
  
});

export const BodyContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  color: "#FFFFFF73",
  fontSize: "clamp(16px, 4vw, 24px)",
  padding: "8px",
  textAlign: "center",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    fontSize: "clamp(14px, 3vw, 16px)",
    padding: "4px",
  },
});

export const PageContainer = styled("div")({
  background: "#0f0f0f",
  gap: "clamp(8px, 2vh, 16px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  color: "#fff",
  height: "100dvh",     // Dynamic viewport height (best)
  width: "100vw",
  padding: "clamp(8px, 2vh, 16px)",
  margin: 0,
  overflow: "hidden",
  boxSizing: "border-box",
  
  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    gap: "clamp(4px, 1vh, 8px)",
    padding: "clamp(4px, 1vh, 8px)",
    height: "100dvh",
    overflow: "hidden",
  },
});