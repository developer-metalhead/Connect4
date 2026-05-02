/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";

// CHANGE: Add monkeylaugh sound to configuration
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
  error: {
    files: ["error.mp3", "error.ogg"], // Using click as a subtle thud
    volume: 0.5,
    pitchVariation: false,
  },
  coinsfalling: {
    files: ["coinsfalling.mp3", "coinsfalling.ogg"],
    volume: 0.8,
    pitchVariation: false,
  },
  // CHANGE: Add monkey laugh sound for post-video overlay
  monkeylaugh: {
    files: ["monkeylaugh.mp3", "monkeylaugh.ogg"],
    volume: 0.8,
    pitchVariation: false,
  },
  chickenbawk: {
    files: ["chickenbawk.mp3", "chickenbawk.ogg"],
    volume: 0.8,
    pitchVariation: false,
  },
  rooster: {
    files: ["rooster.mp3", "rooster.ogg"],
    volume: 0.8,
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
  // CHANGE: Add ref to track currently playing sounds for stopping
  const playingSoundsRef = useRef({});

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

  const logSoundEvent = useCallback(
    (soundKey, action, details = {}) => {
      const timestamp = new Date().toISOString();
      const config = SOUND_CONFIG[soundKey];
    },
    [isMuted, volume, musicVolume],
  );

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

          const canPlay = audio.canPlayType(
            file.endsWith(".mp3") ? "audio/mpeg" : "audio/ogg",
          );
          if (canPlay !== "") {
            logSoundEvent(soundKey, "LOADED", {
              file,
              canPlay,
              finalVolume: audio.volume,
            });
            return audio;
          }
        } catch (error) {
          logSoundEvent(soundKey, "LOAD_FAILED", {
            file,
            error: error.message,
          });
          console.warn(`Failed to load ${file}:`, error);
        }
      }

      logSoundEvent(soundKey, "NO_FORMAT_SUPPORTED", {
        attemptedFiles: config.files,
      });
      console.warn(`No supported audio format found for ${soundKey}`);
      return null;
    },
    [volume, logSoundEvent],
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

    const loadedSounds = Object.keys(instances);
    console.log(`🔊 Sound Manager Initialized - Loaded sounds:`, loadedSounds);

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
        instance.volume = newVolume;
      }

      logSoundEvent(key, "VOLUME_UPDATED", {
        newVolume: newVolume.toFixed(2),
        isMusicTrack: key === "bgMusic",
      });
    });
  }, [volume, musicVolume, logSoundEvent]);

  const saveSoundSettings = useCallback((newSettings) => {
    if (newSettings.isMuted !== undefined) {
      setIsMuted(newSettings.isMuted);
      localStorage.setItem("connect4_muted", JSON.stringify(newSettings.isMuted));
    }
    if (newSettings.volume !== undefined) {
      setVolume(newSettings.volume);
      localStorage.setItem("connect4_volume", newSettings.volume.toString());
    }
    if (newSettings.musicVolume !== undefined) {
      setMusicVolume(newSettings.musicVolume);
      localStorage.setItem("connect4_music_volume", newSettings.musicVolume.toString());
    }
    if (newSettings.isMusicEnabled !== undefined) {
      setIsMusicEnabled(newSettings.isMusicEnabled);
      localStorage.setItem("connect4_music_enabled", JSON.stringify(newSettings.isMusicEnabled));
    }
  }, []);

  // CHANGE: Add stopSound method to stop specific sounds
  const stopSound = useCallback(
    (soundKey) => {
      const playingAudio = playingSoundsRef.current[soundKey];
      if (playingAudio) {
        playingAudio.pause();
        playingAudio.currentTime = 0;
        delete playingSoundsRef.current[soundKey];
        logSoundEvent(soundKey, "STOPPED");
      }
    },
    [logSoundEvent],
  );

  // Play sound with pitch variation support
  const playSound = useCallback(
    (soundKey, options = {}) => {
      if (isMuted || !audioInstancesRef.current[soundKey]) {
        if (isMuted) {
          logSoundEvent(soundKey, "BLOCKED_MUTED");
        } else {
          logSoundEvent(soundKey, "BLOCKED_NOT_LOADED");
        }
        return;
      }

      const instances = audioInstancesRef.current[soundKey];
      const config = SOUND_CONFIG[soundKey];

      let audioToPlay;

      if (Array.isArray(instances)) {
        audioToPlay = instances.find((audio) => audio.paused || audio.ended);
        if (!audioToPlay) audioToPlay = instances[0];
      } else {
        audioToPlay = instances;
      }

      if (!audioToPlay) {
        logSoundEvent(soundKey, "NO_INSTANCE_AVAILABLE");
        return;
      }

      try {
        audioToPlay.currentTime = 0;

        let appliedPitchRate = 1.0;
        if (config.pitchVariation && !options.noPitchVariation) {
          const pitchVariation = 0.9 + Math.random() * 0.2;
          audioToPlay.playbackRate = pitchVariation;
          appliedPitchRate = pitchVariation;
        } else {
          audioToPlay.playbackRate = 1.0;
        }

        // CHANGE: Track playing sound for stopping capability
        playingSoundsRef.current[soundKey] = audioToPlay;

        // CHANGE: Add event listener to clean up tracking when sound ends
        const handleEnded = () => {
          delete playingSoundsRef.current[soundKey];
          audioToPlay.removeEventListener('ended', handleEnded);
        };
        audioToPlay.addEventListener('ended', handleEnded);

        logSoundEvent(soundKey, "PLAYING", {
          pitchRate: appliedPitchRate.toFixed(3),
          currentTime: audioToPlay.currentTime,
          duration: audioToPlay.duration || "unknown",
          instanceType: Array.isArray(instances) ? "pooled" : "single",
        });

        const playPromise = audioToPlay.play();
        if (playPromise) {
          playPromise.catch((error) => {
            logSoundEvent(soundKey, "PLAY_FAILED", {
              error: error.message,
            });
            console.warn(`Failed to play ${soundKey}:`, error);
          });
        }
      } catch (error) {
        logSoundEvent(soundKey, "PLAY_ERROR", {
          error: error.message,
        });
        console.warn(`Error playing ${soundKey}:`, error);
      }
    },
    [isMuted, logSoundEvent],
  );

  // Specialized drop sound with queueing
  const playDropSound = useCallback(() => {
    if (isMuted) {
      logSoundEvent("drop", "DROP_BLOCKED_MUTED");
      return;
    }

    const soundKey = Math.random() > 0.5 ? "drop" : "drop";

    if (isPlayingDropRef.current) {
      dropSoundQueueRef.current.push(soundKey);
      logSoundEvent(soundKey, "QUEUED", {
        queueLength: dropSoundQueueRef.current.length,
      });
      return;
    }

    isPlayingDropRef.current = true;
    logSoundEvent(soundKey, "DROP_SELECTED");
    playSound(soundKey);

    setTimeout(() => {
      isPlayingDropRef.current = false;
      if (dropSoundQueueRef.current.length > 0) {
        const nextSound = dropSoundQueueRef.current.shift();
        logSoundEvent(nextSound, "DEQUEUED", {
          remainingInQueue: dropSoundQueueRef.current.length,
        });
        playDropSound();
      }
    }, 150);
  }, [playSound, isMuted, logSoundEvent]);

  // Background music controls
  const toggleBackgroundMusic = useCallback(() => {
    const bgMusic = audioInstancesRef.current.bgMusic;
    if (!bgMusic) {
      logSoundEvent("bgMusic", "TOGGLE_FAILED_NOT_LOADED");
      return;
    }

    if (isMusicEnabled) {
      bgMusic.pause();
      setIsMusicEnabled(false);
      logSoundEvent("bgMusic", "PAUSED");
    } else {
      if (!isMuted) {
        const playPromise = bgMusic.play();
        if (playPromise) {
          playPromise.catch((error) => {
            logSoundEvent("bgMusic", "PLAY_FAILED", {
              error: error.message,
            });
            console.warn("Failed to play background music:", error);
          });
        }
        logSoundEvent("bgMusic", "STARTED");
      } else {
        logSoundEvent("bgMusic", "START_BLOCKED_MUTED");
      }
      setIsMusicEnabled(true);
    }
  }, [isMusicEnabled, isMuted, logSoundEvent]);

  // Handle music when mute state changes
  useEffect(() => {
    const bgMusic = audioInstancesRef.current.bgMusic;
    if (!bgMusic) return;

    if (isMuted || !isMusicEnabled) {
      bgMusic.pause();
      logSoundEvent("bgMusic", "PAUSED_BY_MUTE_OR_DISABLE", {
        isMuted,
        isMusicEnabled,
      });
    } else if (isMusicEnabled) {
      const playPromise = bgMusic.play();
      if (playPromise) {
        playPromise.catch((error) => {
          logSoundEvent("bgMusic", "AUTO_PLAY_FAILED", {
            error: error.message,
          });
          console.warn("Failed to play background music:", error);
        });
      }
      logSoundEvent("bgMusic", "AUTO_RESUMED");
    }
  }, [isMuted, isMusicEnabled, logSoundEvent]);

  

  // Public API
  return {
    // Sound controls
    playSound,
    // CHANGE: Add stopSound to public API
    stopSound,
    playDropSound,
    playHoverSound: () => playSound("hover"),
    playWinSound: () => playSound("win"),
    playLoseSound: () => playSound("lose"),
    playDrawSound: () => playSound("draw"),
    playClickSound: () => playSound("click"),

    // Settings
    isMuted,
    volume,
    musicVolume,
    isMusicEnabled,
    saveSoundSettings,
    toggleBackgroundMusic,

    // Utility
    isAudioSupported: Object.keys(audioInstancesRef.current).length > 0,
  };
};

export default useSoundManager;