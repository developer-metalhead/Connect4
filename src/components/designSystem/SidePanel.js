import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { tokens } from "./tokens";

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Backdrop = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 2000,
  animation: `${fadeIn} 0.3s ease-out`,
});

const PanelContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "isOpen" && prop !== "isClosing",
})(({ isOpen, isClosing }) => ({
  position: "fixed",
  top: 0,
  right: 0,
  height: "100%",
  width: "min(90vw, 380px)",
  backgroundColor: tokens.glass.background,
  backdropFilter: tokens.glass.blur,
  borderLeft: tokens.glass.border,
  boxShadow: tokens.shadows.lg,
  zIndex: 2001,
  display: "flex",
  flexDirection: "column",
  animation: `${isClosing ? slideOut : slideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  padding: "24px",
  color: "#fff",
}));

const Header = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "32px",
});

const Title = styled("h2")({
  fontSize: "20px",
  fontWeight: 700,
  margin: 0,
  background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const CloseButton = styled("button")({
  background: "rgba(255, 255, 255, 0.1)",
  border: "none",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.6)",
  transition: "all 0.2s",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    transform: "rotate(90deg)",
  },

  "& svg": {
    width: "18px",
    height: "18px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
  },
});

const Content = styled("div")({
  flex: 1,
  overflowY: "auto",
  paddingRight: "8px",
  
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
  },
});

const SidePanel = ({ isOpen, onClose, title, children }) => {
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) setIsClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <Backdrop onClick={handleClose} />
      <PanelContainer isClosing={isClosing}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={handleClose}>
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </CloseButton>
        </Header>
        <Content>{children}</Content>
      </PanelContainer>
    </>
  );
};

export default SidePanel;
