import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_CONFIG = {
  bored: { 
    file: "bored.mp4", 
    volume: 0.8,
    autoplay: false,
    loop: false 
  },
};

export const useVideoManager = () => {
  const videoInstancesRef = useRef({});
  const [isPlaying, setIsPlaying] = useState({});
  const [isLoaded, setIsLoaded] = useState({});
  const [showVideoModal, setShowVideoModal] = useState({});
  // CHANGE: Add state for post-video overlay
  const [showPostVideoOverlay, setShowPostVideoOverlay] = useState(false);

  // Create video instance
  const createVideoInstance = useCallback((videoKey, config) => {
    try {
      const video = document.createElement('video');
      video.src = `/videos/${config.file}`;
      video.preload = 'metadata';
      video.volume = config.volume || 1;
      video.loop = config.loop || false;
      // CHANGE: Set faster playback rate for snappier feel
      video.playbackRate = 1.55;
      
      // CHANGE: Remove controls and make it behave like an animation
      video.controls = false;
      video.style.width = '100%';
      video.style.height = '100%';
      // CHANGE: Use 'fill' to stretch video to fit container dimensions
      video.style.objectFit = 'fill';
      // CHANGE: Disable context menu to prevent download/save options
      video.oncontextmenu = (e) => e.preventDefault();
      // CHANGE: Disable selection and dragging
      video.style.userSelect = 'none';
      video.style.pointerEvents = 'none';
      video.draggable = false;

      // Event listeners
      video.addEventListener('loadeddata', () => {
        setIsLoaded(prev => ({ ...prev, [videoKey]: true }));
        console.log(`📹 Video loaded: ${videoKey}`);
      });

      video.addEventListener('play', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: true }));
        setShowVideoModal(prev => ({ ...prev, [videoKey]: true }));
        console.log(`▶️ Video playing: ${videoKey}`);
      });

      video.addEventListener('pause', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
        console.log(`⏸️ Video paused: ${videoKey}`);
      });

      video.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
        setShowVideoModal(prev => ({ ...prev, [videoKey]: false }));
        // CHANGE: Trigger post-video overlay when video ends
        setShowPostVideoOverlay(true);
        console.log(`🏁 Video ended: ${videoKey}`);
      });

      video.addEventListener('error', (e) => {
        console.warn(`❌ Video error for ${videoKey}:`, e);
        setIsLoaded(prev => ({ ...prev, [videoKey]: false }));
        setShowVideoModal(prev => ({ ...prev, [videoKey]: false }));
      });

      return video;
    } catch (error) {
      console.warn(`Failed to create video instance for ${videoKey}:`, error);
      return null;
    }
  }, []);

  // Initialize video instances
  useEffect(() => {
    const instances = {};

    Object.entries(VIDEO_CONFIG).forEach(([key, config]) => {
      const instance = createVideoInstance(key, config);
      if (instance) {
        instances[key] = instance;
      }
    });

    videoInstancesRef.current = instances;

    // Cleanup function
    return () => {
      Object.values(instances).forEach((video) => {
        if (video && video.parentNode) {
          video.pause();
          video.src = '';
          video.parentNode.removeChild(video);
        }
      });
    };
  }, [createVideoInstance]);

  // Play video
  const playVideo = useCallback((videoKey) => {
    const video = videoInstancesRef.current[videoKey];
    if (!video) {
      console.warn(`Video not found: ${videoKey}`);
      return;
    }

    try {
      video.currentTime = 0;
      // CHANGE: Ensure playback rate is set when playing
      video.playbackRate = 1.55;
      const playPromise = video.play();
      
      if (playPromise) {
        playPromise.catch((error) => {
          console.warn(`Failed to play video ${videoKey}:`, error);
        });
      }
    } catch (error) {
      console.warn(`Error playing video ${videoKey}:`, error);
    }
  }, []);

  // Pause video
  const pauseVideo = useCallback((videoKey) => {
    const video = videoInstancesRef.current[videoKey];
    if (!video) {
      console.warn(`Video not found: ${videoKey}`);
      return;
    }

    try {
      video.pause();
    } catch (error) {
      console.warn(`Error pausing video ${videoKey}:`, error);
    }
  }, []);

  // Stop video (pause and reset)
  const stopVideo = useCallback((videoKey) => {
    const video = videoInstancesRef.current[videoKey];
    if (!video) {
      console.warn(`Video not found: ${videoKey}`);
      return;
    }

    try {
      video.pause();
      video.currentTime = 0;
      setShowVideoModal(prev => ({ ...prev, [videoKey]: false }));
    } catch (error) {
      console.warn(`Error stopping video ${videoKey}:`, error);
    }
  }, []);

  const closeVideoModal = useCallback((videoKey) => {
    setShowVideoModal(prev => ({ ...prev, [videoKey]: false }));
    stopVideo(videoKey);
  }, [stopVideo]);

  // CHANGE: Add function to close post-video overlay
  const closePostVideoOverlay = useCallback(() => {
    setShowPostVideoOverlay(false);
  }, []);

  const playBoredVideo = useCallback(() => {
    playVideo('bored');
  }, [playVideo]);

  const getVideoElement = useCallback((videoKey) => {
    return videoInstancesRef.current[videoKey];
  }, []);

  return {
    // Video controls
    playVideo,
    pauseVideo,
    stopVideo,
    playBoredVideo,
    closeVideoModal,
    
    // State
    isPlaying,
    isLoaded,
    showVideoModal,
    // CHANGE: Export post-video overlay state and controls
    showPostVideoOverlay,
    closePostVideoOverlay,
    
    // Utility
    isVideoSupported: Object.keys(videoInstancesRef.current).length > 0,
    getVideoElement,
  };
};

export default useVideoManager;