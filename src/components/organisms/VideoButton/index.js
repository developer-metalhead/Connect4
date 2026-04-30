import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import useVideoManager from '../../../hooks/core/useVideoManager';

const VideoButton = styled(Button)(({ theme }) => ({
  display: "flex",
  padding: "12px 24px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  fontSize: "18px",
  alignSelf: "stretch",
  borderRadius: "9999px",
  backgroundColor: "#ff6b35",
  color: "#fff",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",

  "&:hover": {
    backgroundColor: "#ff5722",
    boxShadow: "0 6px 16px rgba(255, 107, 53, 0.4)",
  },

  "&:active": {
    backgroundColor: "#e64a19",
  },

  "&:disabled": {
    backgroundColor: "#666",
    color: "#999",
  },
}));

const BoredVideoButton = ({ children = "Play Bored Video", ...props }) => {
  const { playBoredVideo, isPlaying, isLoaded } = useVideoManager();

  const handleClick = () => {
    console.log("🎬 Playing bored video...");
    playBoredVideo();
  };

  const isBoredPlaying = isPlaying.bored;
  const isBoredLoaded = isLoaded.bored;

  return (
    <VideoButton 
      onClick={handleClick} 
      disabled={!isBoredLoaded}
      {...props}
    >
      {!isBoredLoaded ? "Loading..." : isBoredPlaying ? "Playing..." : children}
      {isBoredPlaying ? " 🎬" : " 📹"}
    </VideoButton>
  );
};

export default BoredVideoButton;