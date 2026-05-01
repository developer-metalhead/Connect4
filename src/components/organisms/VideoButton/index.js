import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import useVideoManager from '../../../hooks/core/useVideoManager';
import FunConfirmationModal from '../ConfirmationModal';
import CustomButton from '../buttonComponent';
// CHANGE: Import the new post-video overlay component
import PostVideoOverlay from '../postVideoOverlay';
import useSoundManager from '../../../hooks/core/useSoundManager';

// Fullscreen video modal that stretches to entire screen
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
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
});

// Container that fills entire screen for video stretching
const VideoContainer = styled('div')({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
  overflow: 'hidden',
  '&:focus': {
    outline: 'none',
  },
});

// Close button positioned absolutely and always visible
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
    getVideoElement,
    // CHANGE: Get post-video overlay state and controls
    showPostVideoOverlay,
    closePostVideoOverlay
  } = useVideoManager();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // CHANGE: Get sound manager for post-video overlay
  const soundManager = useSoundManager();

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

  // CHANGE: Handle post-video overlay close
  const handleClosePostVideoOverlay = () => {
    closePostVideoOverlay();
  };

  // Prevent any background clicks from interfering with video
  const handleVideoBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle escape key to close video
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showVideoModal.bored) {
        handleCloseVideoModal();
      }
      // CHANGE: Also handle escape for post-video overlay
      if (e.key === 'Escape' && showPostVideoOverlay) {
        handleClosePostVideoOverlay();
      }
    };

    if (showVideoModal.bored || showPostVideoOverlay) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoModal.bored, showPostVideoOverlay, handleCloseVideoModal, handleClosePostVideoOverlay]);

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

      {/* Fullscreen Video Modal */}
      {showBoredModal && (
        <VideoModal onClick={handleVideoBackdropClick}>
          <VideoContainer>
            <VideoRenderer videoElement={getVideoElement('bored')} />
          </VideoContainer>
        </VideoModal>
      )}

      {/* CHANGE: Post-Video Overlay */}
      <PostVideoOverlay
        isVisible={showPostVideoOverlay}
        onClose={handleClosePostVideoOverlay}
        soundManager={soundManager}
      />
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