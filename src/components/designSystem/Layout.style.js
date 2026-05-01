import { styled } from "@mui/material/styles";
import { tokens } from "./tokens";

export const PageWrapper = styled("div")({
  minHeight: "100vh",
  width: "100%",
  backgroundColor: tokens.colors.background,
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${tokens.colors.background} 70%)`,
  color: tokens.colors.text,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowX: "hidden",
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
  padding: "40px 24px",
  gap: "32px",
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
