import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { tokens } from "../../components/designSystem/tokens";


export const GameLayout = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",

  "@media (max-height: 2400px) and (orientation: portrait)": {
    marginTop: "120px !important",
  },
});

export const LobbyCard = styled("div")({
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  border: tokens.glass.border,
  borderRadius: tokens.radius.lg,
  padding: "32px",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  boxShadow: tokens.shadows.xl,
});

export const RoomBadge = styled("div")({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: tokens.radius.full,
  fontSize: "12px",
  fontWeight: 600,
  color: tokens.colors.textMuted,
  border: `1px solid ${tokens.colors.borderLight}`,
});

export const InviteSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: tokens.radius.md,
  border: `1px solid ${tokens.colors.borderLight}`,
});

export const SectionTitle = styled("h3")({
  fontSize: "14px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: tokens.colors.textDim,
  margin: 0,
});



const blink = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

export const RoomToolbar = styled("div")({
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "100px",
  zIndex: 1000,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",

  // Extra spacing for tall mobile screens (1080x2400)
  "@media (max-height: 2400px) and (orientation: portrait)": {
    top: "32px",
  },
  
  "@media (max-width: 480px)": {
    width: "fit-content",
    padding: "6px 10px",
  }
});

export const LiveGroup = styled("div")({
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  paddingRight: '12px', 
  borderRight: '1px solid rgba(255,255,255,0.1)'
});

export const LiveDot = styled("div")({
  width: '8px', 
  height: '8px', 
  borderRadius: '50%', 
  backgroundColor: '#22c55e', 
  boxShadow: '0 0 8px #22c55e',
  animation: `${blink} 1.5s infinite ease-in-out`,
});

export const LiveText = styled("span")({
  fontSize: '12px', 
  fontWeight: 700, 
  color: '#22c55e', 
  textTransform: 'uppercase', 
  letterSpacing: '1px'
});

export const RoomIdBadge = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "100px",
  fontSize: "14px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.9)",
  letterSpacing: "0.5px",

  "@media (max-width: 480px)": {
    padding: "4px 10px",
    fontSize: "13px",
  }
});

export const CopyButton = styled("button")({
  background: "none",
  border: "none",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.4)",
  transition: "all 0.2s",
  "&:hover": {
    color: tokens.colors.primary,
    transform: "scale(1.1)",
  },
  "& svg": {
    width: "16px",
    height: "16px",
  }
});

export const LeaveButton = styled("button")({
  padding: "6px 16px",
  background: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  borderRadius: "100px",
  fontSize: "13px",
  fontWeight: 700,
  color: "#ef4444",
  cursor: "pointer",
  transition: "all 0.2s",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  "&:hover": {
    background: "#ef4444",
    color: "#fff",
    boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
  }
});