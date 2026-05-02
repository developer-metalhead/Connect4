import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";

const SoundContext = createContext(null);

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
  winWow: { files: ["winwow.mp3"], volume: 0.9, pitchVariation: false },
  booWow: { files: ["booWow.mp3"], volume: 0.7, pitchVariation: false },
  surrender: { files: ["surrender.mp3"], volume: 0.8, pitchVariation: false },
  click: {
    files: ["click.mp3", "click.ogg"],
    volume: 0.6,
    pitchVariation: false,
  },
  error: {
    files: ["error.mp3", "error.ogg"],
    volume: 0.5,
    pitchVariation: false,
  },
  coinsfalling: {
    files: ["coinsfalling.mp3", "coinsfalling.ogg"],
    volume: 0.8,
    pitchVariation: false,
  },
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
    files: ["bg2cut.mp3"],
    volume: 0.3,
    loop: true,
  },
  matchMusic: {
    files: ["matchMusic.mp3"],
    volume: 0.7,
    loop: true,
  },
};

const DEFAULT_VOLUME = 0.75;
const DEFAULT_MUSIC_VOLUME = 0.5;

export const SoundProvider = ({ children }) => {
  const audioInstancesRef = useRef({});
  const playingSoundsRef = useRef({});
  const dropSoundQueueRef = useRef([]);
  const isPlayingDropRef = useRef(false);
  const bgFadeIntervalRef = useRef(null);
  const matchFadeIntervalRef = useRef(null);

  const [isMuted, setIsMuted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("connect4_muted") || "false");
    } catch {
      return false;
    }
  });

  const [volume, setVolume] = useState(() => {
    try {
      return parseFloat(localStorage.getItem("connect4_volume") || DEFAULT_VOLUME);
    } catch {
      return DEFAULT_VOLUME;
    }
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    try {
      return parseFloat(localStorage.getItem("connect4_music_volume") || DEFAULT_MUSIC_VOLUME);
    } catch {
      return DEFAULT_MUSIC_VOLUME;
    }
  });

  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("connect4_music_enabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isMatchMusicEnabled, setIsMatchMusicEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("connect4_match_music_enabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [alternateAudioEnabled, setAlternateAudioEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("connect4_alternate_audio");
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const createAudioInstance = useCallback((soundKey, config) => {
    for (const file of config.files) {
      try {
        const audio = new Audio(`/sounds/${file}`);
        audio.preload = "auto";
        const baseVolume = config.volume || 1;
        audio.volume = baseVolume * (["bgMusic", "matchMusic"].includes(soundKey) ? musicVolume : volume);
        if (config.loop) audio.loop = true;
        return audio;
      } catch (error) {
        console.warn(`Failed to load ${file}:`, error);
      }
    }
    return null;
  }, [volume, musicVolume]);

  useEffect(() => {
    const instances = {};
    Object.entries(SOUND_CONFIG).forEach(([key, config]) => {
      if (key.startsWith("drop")) {
        instances[key] = Array.from({ length: 3 }, () => createAudioInstance(key, config)).filter(Boolean);
      } else {
        const instance = createAudioInstance(key, config);
        if (instance) instances[key] = instance;
      }
    });
    audioInstancesRef.current = instances;

    return () => {
      Object.values(instances).forEach((instance) => {
        if (Array.isArray(instance)) {
          instance.forEach((audio) => { audio.pause(); audio.src = ""; });
        } else if (instance) {
          instance.pause(); instance.src = "";
        }
      });
    };
  }, []); 

  useEffect(() => {
    Object.entries(audioInstancesRef.current).forEach(([key, instance]) => {
      const config = SOUND_CONFIG[key];
      if (!config) return;
      const isMusicTrack = ["bgMusic", "matchMusic"].includes(key);
      const newVolume = isMusicTrack ? (config.volume || 1) * musicVolume : (config.volume || 1) * volume;
      if (Array.isArray(instance)) {
        instance.forEach((audio) => { if (audio) audio.volume = newVolume; });
      } else if (instance) {
        instance.volume = newVolume;
      }
    });
  }, [volume, musicVolume]);

  const pauseBackgroundMusic = useCallback(() => {
    const bg = audioInstancesRef.current.bgMusic;
    const match = audioInstancesRef.current.matchMusic;
    if (!bg) return;
    
    if (bgFadeIntervalRef.current) clearInterval(bgFadeIntervalRef.current);
    if (matchFadeIntervalRef.current) clearInterval(matchFadeIntervalRef.current);

    bgFadeIntervalRef.current = setInterval(() => {
      if (bg.volume > 0.01) {
        bg.volume -= 0.01;
      } else {
        bg.volume = 0;
        bg.pause();
        clearInterval(bgFadeIntervalRef.current);
      }
    }, 30);

    if (match && isMatchMusicEnabled && !isMuted) {
      const targetMatchVol = (SOUND_CONFIG.matchMusic.volume || 1) * musicVolume;
      match.volume = 0;
      match.play().catch(() => {});
      matchFadeIntervalRef.current = setInterval(() => {
        if (match.volume < targetMatchVol - 0.01) {
          match.volume += 0.01;
        } else {
          match.volume = targetMatchVol;
          clearInterval(matchFadeIntervalRef.current);
        }
      }, 30);
    }
  }, [musicVolume, isMuted, isMatchMusicEnabled]);

  const resumeBackgroundMusic = useCallback(() => {
    const bg = audioInstancesRef.current.bgMusic;
    const match = audioInstancesRef.current.matchMusic;
    
    if (bgFadeIntervalRef.current) clearInterval(bgFadeIntervalRef.current);
    if (matchFadeIntervalRef.current) clearInterval(matchFadeIntervalRef.current);

    if (match) {
      matchFadeIntervalRef.current = setInterval(() => {
        if (match.volume > 0.01) {
          match.volume -= 0.01;
        } else {
          match.volume = 0;
          match.pause();
          clearInterval(matchFadeIntervalRef.current);
        }
      }, 30);
    }

    if (bg && isMusicEnabled && !isMuted) {
      const targetBgVol = (SOUND_CONFIG.bgMusic.volume || 1) * musicVolume;
      if (bg.paused) {
        bg.volume = 0;
        bg.play().catch(() => {});
      }
      bgFadeIntervalRef.current = setInterval(() => {
        if (bg.volume < targetBgVol - 0.01) {
          bg.volume += 0.01;
        } else {
          bg.volume = targetBgVol;
          clearInterval(bgFadeIntervalRef.current);
        }
      }, 30);
    }
  }, [isMusicEnabled, musicVolume, isMuted]);

  const stopSound = useCallback((soundKey) => {
    const audio = playingSoundsRef.current[soundKey];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      delete playingSoundsRef.current[soundKey];
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.keys(playingSoundsRef.current).forEach(key => stopSound(key));
  }, [stopSound]);

  const playSound = useCallback((soundKey, options = {}) => {
    if (isMuted || !audioInstancesRef.current[soundKey]) return;
    const instances = audioInstancesRef.current[soundKey];
    const config = SOUND_CONFIG[soundKey];
    let audioToPlay = Array.isArray(instances) ? (instances.find(a => a.paused || a.ended) || instances[0]) : instances;
    
    if (!audioToPlay) return;

    try {
      audioToPlay.currentTime = 0;
      if (config.pitchVariation && !options.noPitchVariation) {
        audioToPlay.playbackRate = 0.9 + Math.random() * 0.2;
      } else {
        audioToPlay.playbackRate = 1.0;
      }
      playingSoundsRef.current[soundKey] = audioToPlay;
      const handleEnded = () => {
        delete playingSoundsRef.current[soundKey];
        audioToPlay.removeEventListener('ended', handleEnded);
      };
      audioToPlay.addEventListener('ended', handleEnded);
      audioToPlay.play().catch(() => {});
    } catch (error) {
      console.warn(`Error playing ${soundKey}:`, error);
    }
  }, [isMuted]);

  const playDropSound = useCallback(() => {
    if (isMuted) return;
    if (isPlayingDropRef.current) {
      dropSoundQueueRef.current.push("drop");
      return;
    }
    isPlayingDropRef.current = true;
    playSound("drop");
    setTimeout(() => {
      isPlayingDropRef.current = false;
      if (dropSoundQueueRef.current.length > 0) {
        dropSoundQueueRef.current.shift();
        playDropSound();
      }
    }, 150);
  }, [playSound, isMuted]);

  // Initial music play
  useEffect(() => {
    const bg = audioInstancesRef.current.bgMusic;
    if (bg && isMusicEnabled && !isMuted && bg.paused) {
      bg.volume = (SOUND_CONFIG.bgMusic.volume || 1) * musicVolume;
      bg.play().catch(() => {});
    }
  }, [isMusicEnabled, isMuted, musicVolume]);

  const value = {
    playSound,
    stopSound,
    stopAllSounds,
    playDropSound,
    playHoverSound: () => playSound("hover"),
    playWinSound: (opts = {}) => {
      const soundsToStop = ["win", "lose", "draw", "winWow", "booWow", "surrender"];
      soundsToStop.forEach(s => stopSound(s));
      playSound((opts.alternate || alternateAudioEnabled || opts.isFunMode) ? "winWow" : "win");
    },
    playLoseSound: (opts = {}) => {
      const soundsToStop = ["win", "lose", "draw", "winWow", "booWow", "surrender"];
      soundsToStop.forEach(s => stopSound(s));
      playSound((opts.alternate || alternateAudioEnabled || opts.isFunMode) ? "booWow" : "lose");
    },
    playSurrenderSound: () => {
      const soundsToStop = ["win", "lose", "draw", "winWow", "booWow", "surrender"];
      soundsToStop.forEach(s => stopSound(s));
      playSound("surrender");
    },
    playDrawSound: () => {
      const soundsToStop = ["win", "lose", "draw", "winWow", "booWow", "surrender"];
      soundsToStop.forEach(s => stopSound(s));
      playSound("draw");
    },
    playClickSound: () => playSound("click"),
    isMuted,
    volume,
    musicVolume,
    isMusicEnabled,
    isMatchMusicEnabled,
    alternateAudioEnabled,
    saveSoundSettings: (newSettings) => {
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
      if (newSettings.isMatchMusicEnabled !== undefined) {
        setIsMatchMusicEnabled(newSettings.isMatchMusicEnabled);
        localStorage.setItem("connect4_match_music_enabled", JSON.stringify(newSettings.isMatchMusicEnabled));
      }
      if (newSettings.alternateAudioEnabled !== undefined) {
        setAlternateAudioEnabled(newSettings.alternateAudioEnabled);
        localStorage.setItem("connect4_alternate_audio", JSON.stringify(newSettings.alternateAudioEnabled));
      }
    },
    toggleBackgroundMusic: () => {
      const newState = !isMusicEnabled;
      setIsMusicEnabled(newState);
      localStorage.setItem("connect4_music_enabled", JSON.stringify(newState));
    },
    toggleMatchMusic: () => {
      const newState = !isMatchMusicEnabled;
      setIsMatchMusicEnabled(newState);
      localStorage.setItem("connect4_match_music_enabled", JSON.stringify(newState));
    },
    toggleAlternateAudio: () => {
      const newState = !alternateAudioEnabled;
      setAlternateAudioEnabled(newState);
      localStorage.setItem("connect4_alternate_audio", JSON.stringify(newState));
    },
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    isAudioSupported: Object.keys(audioInstancesRef.current).length > 0,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSoundManagerContext = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundManagerContext must be used within a SoundProvider");
  return context;
};
