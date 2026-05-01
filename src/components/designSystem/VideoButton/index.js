import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { tokens } from '../tokens';
import useVideoManager from '../../../hooks/core/useVideoManager';
import useSoundManager from '../../../hooks/core/useSoundManager';
import ConfirmationModal from '../ConfirmationModal';
import Button from '../Button';

const VideoOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#000',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 0.5s ease-out',
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  }
});

const VideoContainer = styled('div')({
  width: '100vw',
  height: '100vh',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const VideoButton = ({ children = "Give Up!", onGameReset, ...props }) => {
  const { 
    playBoredVideo, 
    isPlaying, 
    isLoaded, 
    showVideoModal, 
    closeVideoModal, 
    getVideoElement,
    showPostVideoOverlay,
    closePostVideoOverlay
  } = useVideoManager();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const soundManager = useSoundManager();

  const handleClick = () => {
    setShowConfirmModal(true);
  };

  const handleAccept = () => {
    setShowConfirmModal(false);
    if (onGameReset) onGameReset();
    playBoredVideo();
  };

  useEffect(() => {
    if (showVideoModal.bored || showPostVideoOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showVideoModal.bored, showPostVideoOverlay]);

  const isBoredLoaded = isLoaded.bored;
  const showBoredModal = showVideoModal.bored;

  return (
    <>
      <Button 
        variant="danger" 
        onClick={handleClick} 
        disabled={!isBoredLoaded}
        {...props}
      >
        {!isBoredLoaded ? "Loading..." : children}
      </Button>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onAccept={handleAccept}
        onDecline={() => setShowConfirmModal(false)}
        onClose={() => setShowConfirmModal(false)}
        title="I suck and want to give up"
        message="Do you want to be such a sore loser? Resetting the game and having some 'fun'?"
        acceptLabel="Yes, I am retarded !"
        declineLabel="No, bring the pain !"
      />

      {showBoredModal && (
        <VideoOverlay>
          <VideoContainer>
            <VideoRenderer videoElement={getVideoElement('bored')} />
          </VideoContainer>
        </VideoOverlay>
      )}
    </>
  );
};

const VideoRenderer = ({ videoElement }) => {
  const containerRef = useRef(null);

  useEffect(() => {
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

export default VideoButton;
