import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// Custom Styled Button
const CustomButton = styled(Button)(({ theme }) => ({
  display: "flex",
  padding: "12px 24px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  fontSize: "18px",
  alignSelf: "stretch",
  borderRadius: "9999px",
  backgroundColor: "#fff",
  color: "#000",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",

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
}));

export default CustomButton;
