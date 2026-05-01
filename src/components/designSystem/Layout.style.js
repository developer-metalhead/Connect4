import { styled } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { tokens } from "./tokens";

export const GlobalLayoutStyles = (
  <GlobalStyles
    styles={{
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      "html, body": {
        overflow: "hidden !important",
        overscrollBehavior: "none !important",
        height: "100%",
        width: "100%",
        position: "fixed",
      },
      /* Custom Themed Scrollbar for internal panels */
      "*::-webkit-scrollbar": {
        width: "6px",
      },
      "*::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "*::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        backgroundClip: "content-box",
      },
    }}
  />
);

export const PageWrapper = styled("div")({
  height: "100vh",
  width: "100vw",
  backgroundColor: tokens.colors.background,
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${tokens.colors.background} 70%)`,
  color: tokens.colors.text,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden !important", 
  position: "fixed", // Hard lock
  inset: 0,
  touchAction: "none !important",
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
  padding: "16px",
  gap: "16px",
  overflowY: "auto", // Only internal scrolling allowed
  overflowX: "hidden",
  justifyContent: "flex-start",

  "@media (min-width: 768px)": {
    padding: "24px", 
    gap: "24px",
    justifyContent: "center",
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

export const RefreshIconButton = styled("button")({
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: tokens.radius.full,
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.6)",
  transition: "all 0.2s",
  backdropFilter: "blur(8px)",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    transform: "rotate(180deg)",
  },

  "& svg": {
    width: "20px",
    height: "20px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  }
});
