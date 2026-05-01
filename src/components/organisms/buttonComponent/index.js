import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// Custom Styled Button with sound support

const CustomButton = styled(Button)(({ theme }) => ({
  display: "flex",
  padding: "clamp(8px, 2vh, 12px) clamp(16px, 4vw, 24px)",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  fontSize: "clamp(14px, 3.5vw, 18px)",
  alignSelf: "stretch",
  borderRadius: "9999px",
  backgroundColor: "#fff",
  color: "#000",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  minHeight: "44px",
  width: "100%",


  "&:hover": {
    backgroundColor: "#d4d7db",
    boxShadow: "none",
  },

  "&:active": {
    backgroundColor: "#0f172a",
  },

  // Optional: Add variants
  "&.secondary": {
    backgroundColor: "transparent",
    border: "2px solid #111827",
    color: "#111827",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },

  // Mobile optimization for 1080x2400
  "@media (max-width: 480px) and (max-height: 2400px)": {
    padding: "clamp(6px, 1.5vh, 10px) clamp(12px, 3vw, 20px)",
    fontSize: "clamp(12px, 3vw, 16px)",
    minHeight: "40px",
  },
}));


// Enhanced button component with sound integration
const SoundAwareButton = ({ children, onClick, soundManager, ...props }) => {
  const handleClick = (e) => {
    // Play click sound
    if (soundManager) {
      soundManager.playClickSound();
    }

    // Call original onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <CustomButton onClick={handleClick} {...props}>
      {children}
    </CustomButton>
  );
};

export default SoundAwareButton;
