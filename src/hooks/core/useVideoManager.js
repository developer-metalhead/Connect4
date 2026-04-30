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

  // Create video instance
  const createVideoInstance = useCallback((videoKey, config) => {
    try {
      const video = document.createElement('video');
      video.src = `/videos/${config.file}`;
      video.preload = 'metadata';
      video.volume = config.volume || 1;
      video.loop = config.loop || false;
      
      // Add video to DOM but keep it hidden
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      
      document.body.appendChild(video);

      // Event listeners
      video.addEventListener('loadeddata', () => {
        setIsLoaded(prev => ({ ...prev, [videoKey]: true }));
        console.log(`📹 Video loaded: ${videoKey}`);
      });

      video.addEventListener('play', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: true }));
        console.log(`▶️ Video playing: ${videoKey}`);
      });

      video.addEventListener('pause', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
        console.log(`⏸️ Video paused: ${videoKey}`);
      });

      video.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
        console.log(`🏁 Video ended: ${videoKey}`);
      });

      video.addEventListener('error', (e) => {
        console.warn(`❌ Video error for ${videoKey}:`, e);
        setIsLoaded(prev => ({ ...prev, [videoKey]: false }));
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
      video.currentTime = 0; // Reset to beginning
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
    } catch (error) {
      console.warn(`Error stopping video ${videoKey}:`, error);
    }
  }, []);

  // Play bored video specifically
  const playBoredVideo = useCallback(() => {
    playVideo('bored');
  }, [playVideo]);

  return {
    // Video controls
    playVideo,
    pauseVideo,
    stopVideo,
    playBoredVideo,
    
    // State
    isPlaying,
    isLoaded,
    
    // Utility
    isVideoSupported: Object.keys(videoInstancesRef.current).length > 0,
  };
};

export default useVideoManager;