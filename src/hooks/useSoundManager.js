/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";

// Sound configuration with multiple format support
const SOUND_CONFIG = {
  drop: { files: ["drop.mp3", "drop.ogg"], volume: 0.8, pitchVariation: true },
  drop2: {
    files: ["drop2.mp3", "drop2.ogg"],
    volume: 0.8,
    pitchVariation: true,
  },
  hover: {
    files: ["hover.mp3", "hover.ogg"],
    volume: 0.4,
    pitchVariation: false,
  },
  win: { files: ["win.mp3", "win.ogg"], volume: 0.9, pitchVariation: false },
  lose: { files: ["lose.mp3", "lose.ogg"], volume: 0.7, pitchVariation: false },
  draw: { files: ["draw.mp3", "draw.ogg"], volume: 0.7, pitchVariation: false },
  click: {
    files: ["click.mp3", "click.ogg"],
    volume: 0.6,
    pitchVariation: false,
  },
  bgMusic: {
    files: ["background.mp3", "background.ogg"],
    volume: 0.3,
    loop: true,
  },
};

const DEFAULT_VOLUME = 0.75;
const DEFAULT_MUSIC_VOLUME = 0.2;

export const useSoundManager = () => {
  const audioInstancesRef = useRef({});
  const dropSoundQueueRef = useRef([]);
  const isPlayingDropRef = useRef(false);

  // State management with localStorage persistence
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("connect4_muted") || "false");
    } catch {
      return false;
    }
  });

  const [volume, setVolume] = useState(() => {
    try {
      return parseFloat(
        localStorage.getItem("connect4_volume") || DEFAULT_VOLUME,
      );
    } catch {
      return DEFAULT_VOLUME;
    }
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    try {
      return parseFloat(
        localStorage.getItem("connect4_music_volume") || DEFAULT_MUSIC_VOLUME,
      );
    } catch {
      return DEFAULT_MUSIC_VOLUME;
    }
  });

  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("connect4_music_enabled") || "false",
      );
    } catch {
      return false;
    }
  });

  // Create audio instance with fallback format support
  const createAudioInstance = useCallback(
    (soundKey, config) => {
      for (const file of config.files) {
        try {
          const audio = new Audio(`/sounds/${file}`);
          audio.preload = "auto";
          audio.volume = (config.volume || 1) * volume;

          if (config.loop) {
            audio.loop = true;
          }

          // Test if the audio can be played
          const canPlay = audio.canPlayType(
            file.endsWith(".mp3") ? "audio/mpeg" : "audio/ogg",
          );
          if (canPlay !== "") {
            return audio;
          }
        } catch (error) {
          console.warn(`Failed to load ${file}:`, error);
        }
      }

      console.warn(`No supported audio format found for ${soundKey}`);
      return null;
    },
    [volume],
  );

  // Initialize audio instances
  useEffect(() => {
    const instances = {};

    Object.entries(SOUND_CONFIG).forEach(([key, config]) => {
      // Create multiple instances for drop sounds to prevent overlap
      if (key.startsWith("drop")) {
        instances[key] = Array.from({ length: 3 }, () =>
          createAudioInstance(key, config),
        ).filter(Boolean);
      } else {
        const instance = createAudioInstance(key, config);
        if (instance) {
          instances[key] = instance;
        }
      }
    });

    audioInstancesRef.current = instances;

    // Cleanup function
    return () => {
      Object.values(instances).forEach((instance) => {
        if (Array.isArray(instance)) {
          instance.forEach((audio) => {
            audio.pause();
            audio.src = "";
          });
        } else if (instance) {
          instance.pause();
          instance.src = "";
        }
      });
    };
  }, [createAudioInstance]);

  // Update volumes when settings change
  useEffect(() => {
    Object.entries(audioInstancesRef.current).forEach(([key, instance]) => {
      const config = SOUND_CONFIG[key];
      if (!config) return;

      const newVolume =
        key === "bgMusic"
          ? (config.volume || 1) * musicVolume
          : (config.volume || 1) * volume;

      if (Array.isArray(instance)) {
        instance.forEach((audio) => {
          if (audio) audio.volume = newVolume;
        });
      } else if (instance) {
        instance.volume = newVolume;
      }
    });
  }, [volume, musicVolume]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("connect4_muted", JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem("connect4_volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("connect4_music_volume", musicVolume.toString());
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem(
      "connect4_music_enabled",
      JSON.stringify(isMusicEnabled),
    );
  }, [isMusicEnabled]);

  // Play sound with pitch variation support
  const playSound = useCallback(
    (soundKey, options = {}) => {
      if (isMuted || !audioInstancesRef.current[soundKey]) return;

      const instances = audioInstancesRef.current[soundKey];
      const config = SOUND_CONFIG[soundKey];

      let audioToPlay;

      if (Array.isArray(instances)) {
        // Find available instance for drop sounds
        audioToPlay = instances.find((audio) => audio.paused || audio.ended);
        if (!audioToPlay) audioToPlay = instances[0]; // Fallback to first instance
      } else {
        audioToPlay = instances;
      }

      if (!audioToPlay) return;

      try {
        // Reset audio to beginning
        audioToPlay.currentTime = 0;

        // Apply pitch variation for drop sounds
        if (config.pitchVariation && !options.noPitchVariation) {
          const pitchVariation = 0.9 + Math.random() * 0.2; // ±10% pitch variation
          audioToPlay.playbackRate = pitchVariation;
        } else {
          audioToPlay.playbackRate = 1.0;
        }

        // Play the sound
        const playPromise = audioToPlay.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.warn(`Failed to play ${soundKey}:`, error);
          });
        }
      } catch (error) {
        console.warn(`Error playing ${soundKey}:`, error);
      }
    },
    [isMuted],
  );

  // Specialized drop sound with queueing
  const playDropSound = useCallback(() => {
    if (isMuted) return;

    // Randomly choose between drop and drop2 for variety
    const soundKey = Math.random() > 0.5 ? "drop" : "drop2";

    if (isPlayingDropRef.current) {
      dropSoundQueueRef.current.push(soundKey);
      return;
    }

    isPlayingDropRef.current = true;
    playSound(soundKey);

    // Process queue after a short delay
    setTimeout(() => {
      isPlayingDropRef.current = false;
      if (dropSoundQueueRef.current.length > 0) {
        const nextSound = dropSoundQueueRef.current.shift();
        playDropSound();
      }
    }, 150);
  }, [playSound, isMuted]);

  // Background music controls
  const toggleBackgroundMusic = useCallback(() => {
    const bgMusic = audioInstancesRef.current.bgMusic;
    if (!bgMusic) return;

    if (isMusicEnabled) {
      bgMusic.pause();
      setIsMusicEnabled(false);
    } else {
      if (!isMuted) {
        const playPromise = bgMusic.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.warn("Failed to play background music:", error);
          });
        }
      }
      setIsMusicEnabled(true);
    }
  }, [isMusicEnabled, isMuted]);

  // Handle music when mute state changes
  useEffect(() => {
    const bgMusic = audioInstancesRef.current.bgMusic;
    if (!bgMusic) return;

    if (isMuted || !isMusicEnabled) {
      bgMusic.pause();
    } else if (isMusicEnabled) {
      const playPromise = bgMusic.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.warn("Failed to play background music:", error);
        });
      }
    }
  }, [isMuted, isMusicEnabled]);

  // Public API
  return {
    // Sound controls
    playSound,
    playDropSound,
    playHoverSound: () => playSound("hover"),
    playWinSound: () => playSound("win"),
    playLoseSound: () => playSound("lose"),
    playDrawSound: () => playSound("draw"),
    playClickSound: () => playSound("click"),

    // Settings
    isMuted,
    setIsMuted,
    volume,
    setVolume: (newVolume) => setVolume(Math.max(0, Math.min(1, newVolume))),
    musicVolume,
    setMusicVolume: (newVolume) =>
      setMusicVolume(Math.max(0, Math.min(1, newVolume))),
    isMusicEnabled,
    toggleBackgroundMusic,

    // Utility
    isAudioSupported: Object.keys(audioInstancesRef.current).length > 0,
  };
};

export default useSoundManager;
