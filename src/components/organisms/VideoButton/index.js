import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import useVideoManager from '../../../hooks/core/useVideoManager';
import FunConfirmationModal from '../ConfirmationModal';
import CustomButton from '../buttonComponent';

// CHANGE: Fullscreen video modal that stretches to entire screen
const VideoModal = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // CHANGE: Disable any interaction that might show browser controls
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
});

// CHANGE: Container that fills entire screen for video stretching
const VideoContainer = styled('div')({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
  overflow: 'hidden',
  // CHANGE: Disable context menu on container
  '&:focus': {
    outline: 'none',
  },
});

// CHANGE: Close button positioned absolutely and always visible
const CloseButton = styled('button')({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  color: '#000',
  fontSize: '24px',
  cursor: 'pointer',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 1)',
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

  // CHANGE: Prevent any background clicks from interfering with video
  const handleVideoBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only close if clicking the close button, not the video area
  };

  // CHANGE: Handle escape key to close video
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showVideoModal.bored) {
        handleCloseVideoModal();
      }
    };

    if (showVideoModal.bored) {
      document.addEventListener('keydown', handleEscape);
      // CHANGE: Prevent scrolling when video is playing
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoModal.bored, handleCloseVideoModal]);

  const isBoredPlaying = isPlaying.bored;
  const isBoredLoaded = isLoaded.bored;
  const showBoredModal = showVideoModal.bored;

  return (
    <>
      <CustomButton 
        onClick={handleClick} 
        disabled={!isBoredLoaded}
        style={{
          backgroundColor: "#ff6b35",
          color: "#fff",
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
        }}
        {...props}
      >
        {!isBoredLoaded ? "Loading fun..." : isBoredPlaying ? "Having fun..." : children}
      </CustomButton>

      {/* Confirmation Modal */}
      <FunConfirmationModal
        isOpen={showConfirmModal}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onClose={handleCloseConfirmModal}
      />

      {/* CHANGE: Fullscreen Video Modal */}
      {showBoredModal && (
        <VideoModal onClick={handleVideoBackdropClick}>
          <VideoContainer>
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

  // CHANGE: Container fills entire screen for video stretching
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default BoredVideoButton;