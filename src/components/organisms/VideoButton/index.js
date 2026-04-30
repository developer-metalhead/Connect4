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

// CHANGE: Add styled components for video modal
const VideoModal = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '20px',
});

const VideoContainer = styled('div')({
  position: 'relative',
  width: '90vw',
  height: '90vh',
  maxWidth: '1200px',
  maxHeight: '800px',
  backgroundColor: '#000',
  borderRadius: '12px',
  overflow: 'hidden',
});

const CloseButton = styled('button')({
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  color: '#fff',
  fontSize: '20px',
  cursor: 'pointer',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
  },
});

const BoredVideoButton = ({ children = "Play Bored Video", ...props }) => {
  const { 
    playBoredVideo, 
    isPlaying, 
    isLoaded, 
    showVideoModal, 
    closeVideoModal, 
    getVideoElement 
  } = useVideoManager();

  const handleClick = () => {
    console.log("🎬 Playing bored video...");
    playBoredVideo();
  };

  // CHANGE: Add function to handle modal close
  const handleCloseModal = () => {
    closeVideoModal('bored');
  };

  // CHANGE: Add function to handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const isBoredPlaying = isPlaying.bored;
  const isBoredLoaded = isLoaded.bored;
  const showBoredModal = showVideoModal.bored;

  return (
    <>
      <VideoButton 
        onClick={handleClick} 
        disabled={!isBoredLoaded}
        {...props}
      >
        {!isBoredLoaded ? "Loading fun..." : isBoredPlaying ? "Having fun..." : children}
     
      </VideoButton>

      {/* CHANGE: Add video modal that shows when video is playing */}
      {showBoredModal && (
        <VideoModal onClick={handleBackdropClick}>
          <VideoContainer>
            <CloseButton onClick={handleCloseModal}>
              ×
            </CloseButton>
            {/* CHANGE: Render the actual video element in the modal */}
            <VideoRenderer videoElement={getVideoElement('bored')} />
          </VideoContainer>
        </VideoModal>
      )}
    </>
  );
};

// CHANGE: Add component to render video element in React
const VideoRenderer = ({ videoElement }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current && videoElement) {
      // Append the video element to our container
      containerRef.current.appendChild(videoElement);
      
      return () => {
        // Clean up by removing the video element when component unmounts
        if (containerRef.current && videoElement && containerRef.current.contains(videoElement)) {
          containerRef.current.removeChild(videoElement);
        }
      };
    }
  }, [videoElement]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default BoredVideoButton;