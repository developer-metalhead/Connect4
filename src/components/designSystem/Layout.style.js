import { styled } from "@mui/material/styles";
import { tokens } from "./tokens";

export const PageWrapper = styled("div")({
  height: "100vh",
  width: "100%",
  backgroundColor: tokens.colors.background,
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${tokens.colors.background} 70%)`,
  color: tokens.colors.text,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden", // Prevent any page-level scrolling
  position: "relative",
});

export const Header = styled("header")({
  width: "100%",
  height: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  borderBottom: tokens.glass.border,

  "@media (max-width: 768px)": {
    height: "56px",
    padding: "0 16px",
  }
});

export const HeaderContent = styled("div")({
  width: "100%",
  maxWidth: "1200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const AppLogo = styled("div")({
  display: "flex",
  alignItems: "center",
  marginLeft:'12px',
  gap: "12px",
  fontSize: "20px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  background: "linear-gradient(to right, #fff, #94a3b8)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  cursor: "pointer",
});

export const MainContent = styled("main")({
  width: "100%",
  maxWidth: "1200px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "12px 16px", // Minimized for 1080x2400
  gap: "16px",
  overflow: "hidden", // Keep game content contained
  justifyContent: "center",

  "@media (max-width: 768px)": {
    padding: "8px 12px",
    justifyContent: "flex-start", // Start from top on mobile to avoid being cut off
    gap: "8px",
  },

  "@media (min-width: 768px)": {
    padding: "40px 24px",
    gap: "32px",
  }
});

export const GameContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  animation: "fadeIn 0.5s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
});
