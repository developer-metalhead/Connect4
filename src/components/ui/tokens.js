export const tokens = {
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  fonts: {
    weight: 600,
  },
  colors: {
    // Backgrounds
    background: "#020617", // Deepest black-blue
    surface: "#0f172a",    // Slate-900
    surfaceLight: "#1e293b", // Slate-800
    
    // Brand
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#6366f1", // Indigo
    
    // State
    danger: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    
    // Text
    text: "#f8fafc",       // Slate-50
    textMuted: "#94a3b8",  // Slate-400
    textDim: "#64748b",    // Slate-500
    
    // Borders
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.05)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    primary: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
  },
  glass: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    blur: "blur(12px)",
  }
};
