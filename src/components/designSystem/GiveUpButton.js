import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { tokens } from "./tokens";
import { useVideoManager } from "../../hooks/core/useVideoManager";
import { useGameSettings } from "../../hooks/settings/useGameSettings";
import ConfirmationModal from "./ConfirmationModal";

const IconButton = styled("button")({
  position: "fixed",
  top: "11px",
  right: "12px",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 3000,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  color: "#ef4444",

  "@media (max-width: 768px)": {
    width: "40px",
    height: "40px",
    top: "8px",
    right: "8px",
  },

  "@media (max-width: 768px)": {
    width: "40px",
    height: "40px",
    top: "8px",
    right: "8px",
  },
  boxShadow: tokens.shadows.md,
  padding: 0,
  borderColor: "rgba(239, 68, 68, 0.4)",

  "&:hover": {
    background: "rgba(239, 68, 68, 0.25)",
    borderColor: "#ef4444",
    color: "#fff",
    boxShadow: "0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)",
    transform: "translateY(-2px) scale(1.03)",
  },

  "&:active": {
    transform: "scale(0.95)",
    boxShadow: tokens.shadows.sm,
  },

  "& svg": {
    width: "24px",
    height: "24px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",

    "@media (max-width: 768px)": {
      width: "20px",
      height: "20px",
    }
  },
});

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

const GiveUpButton = ({ onGiveUp, soundManager, seriousCPU }) => {
  const { 
    playBoredVideo, 
    isLoaded, 
    showVideoModal, 
    getVideoElement,
    showPostVideoOverlay,
    closePostVideoOverlay
  } = useVideoManager();
  const { monkeyAnimationEnabled } = useGameSettings();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleClick = () => {
    if (soundManager?.playClickSound) soundManager.playClickSound();
    setShowConfirmModal(true);
  };

  const handleAccept = () => {
    setShowConfirmModal(false);
    
    if (seriousCPU) {
      // Serious CPU overrides all animations/overlays
      if (onGiveUp) onGiveUp();
    } else if (monkeyAnimationEnabled) {
      playBoredVideo();
      setShouldNavigate(true);
    } else {
      // Immediate navigation (which will trigger PostVideoOverlay or card)
      if (onGiveUp) onGiveUp();
    }
  };

  useEffect(() => {
    // When video ends, showPostVideoOverlay becomes true.
    // We listen to this to trigger the navigation.
    if (showPostVideoOverlay && shouldNavigate && monkeyAnimationEnabled) {
      closePostVideoOverlay();
      if (onGiveUp) onGiveUp();
    }
  }, [showPostVideoOverlay, shouldNavigate, monkeyAnimationEnabled, onGiveUp, closePostVideoOverlay]);

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
      <IconButton 
        onClick={handleClick} 
        aria-label="Give up"
        disabled={!isBoredLoaded}
        style={{ opacity: isBoredLoaded ? 1 : 0.5 }}
      >
        <svg viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </IconButton>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onAccept={handleAccept}
        onDecline={() => setShowConfirmModal(false)}
        onClose={() => setShowConfirmModal(false)}
        title="I suck and want to give up"
        message="Do you want to be such a sore loser? Leaving the game in shame?"
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

export default GiveUpButton;
