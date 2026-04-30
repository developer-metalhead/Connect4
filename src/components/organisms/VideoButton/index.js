import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import useVideoManager from '../../../hooks/core/useVideoManager';
import FunConfirmationModal from '../ConfirmationModal';

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

const BoredVideoButton = ({ children = "Extremely Fun Button!", onGameReset, ...props }) => {
  const { 
    playBoredVideo, 
    isPlaying, 
    isLoaded, 
    showVideoModal, 
    closeVideoModal, 
    getVideoElement 
  } = useVideoManager();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClick = () => {
    console.log("🎬 Fun button clicked - showing confirmation modal...");
    setShowConfirmModal(true);
  };

  const handleAccept = () => {
    console.log("🎉 User accepted more fun - playing video and resetting game!");
    setShowConfirmModal(false);
    
    // Reset the game first
    if (onGameReset) {
      onGameReset();
    }
    
    // Then play the video
    playBoredVideo();
  };

  const handleDecline = () => {
    console.log("😊 User declined more fun - keeping current state");
    setShowConfirmModal(false);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleCloseVideoModal = () => {
    closeVideoModal('bored');
  };

  const handleVideoBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseVideoModal();
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

      {/* Confirmation Modal */}
      <FunConfirmationModal
        isOpen={showConfirmModal}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onClose={handleCloseConfirmModal}
      />

      {/* Video Modal */}
      {showBoredModal && (
        <VideoModal onClick={handleVideoBackdropClick}>
          <VideoContainer>
            <CloseButton onClick={handleCloseVideoModal}>
              ×
            </CloseButton>
            <VideoRenderer videoElement={getVideoElement('bored')} />
          </VideoContainer>
        </VideoModal>
      )}
    </>
  );
};

const VideoRenderer = ({ videoElement }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current && videoElement) {
      containerRef.current.appendChild(videoElement);
      
      return () => {
        if (containerRef.current && videoElement && containerRef.current.contains(videoElement)) {
          containerRef.current.removeChild(videoElement);
        }
      };
    }
  }, [videoElement]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default BoredVideoButton;