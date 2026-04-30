import React from 'react';
import { styled } from '@mui/material/styles';
import CustomButton from '../buttonComponent';

const SettingsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '20px',
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #333',
  minWidth: '300px',
});

const SettingRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});

const Label = styled('label')({
  color: '#fff',
  fontSize: '14px',
  fontWeight: '500',
  minWidth: '120px',
});

const Slider = styled('input')({
  flex: 1,
  height: '4px',
  borderRadius: '2px',
  background: '#333',
  outline: 'none',
  
  '&::-webkit-slider-thumb': {
    appearance: 'none',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#61dafb',
    cursor: 'pointer',
  },
  
  '&::-moz-range-thumb': {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#61dafb',
    cursor: 'pointer',
    border: 'none',
  },
});

const VolumeDisplay = styled('span')({
  color: '#ccc',
  fontSize: '12px',
  minWidth: '35px',
  textAlign: 'right',
});

const FunModeSettings = ({ soundManager, onClose }) => {
  const {
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    musicVolume,
    setMusicVolume,
    isMusicEnabled,
    toggleBackgroundMusic,
    playClickSound,
    isAudioSupported
  } = soundManager;

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    playClickSound();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleMusicVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setMusicVolume(newVolume);
  };

  const handleMusicToggle = () => {
    toggleBackgroundMusic();
    playClickSound();
  };

  const handleTestSound = () => {
    soundManager.playDropSound();
  };

  if (!isAudioSupported) {
    return (
      <SettingsContainer>
        <Label style={{ textAlign: 'center', color: '#ff6b6b' }}>
          Audio not supported in this browser
        </Label>
        <CustomButton onClick={onClose}>Close</CustomButton>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <h3 style={{ color: '#fff', margin: '0 0 16px 0', textAlign: 'center' }}>
        Sound Settings
      </h3>
      
      <SettingRow>
        <Label>Master Audio</Label>
        <CustomButton 
          onClick={handleMuteToggle}
          style={{ 
            backgroundColor: isMuted ? '#ff6b6b' : '#4caf50',
            minWidth: '80px'
          }}
        >
          {isMuted ? 'Muted' : 'On'}
        </CustomButton>
      </SettingRow>

      <SettingRow>
        <Label>Sound Volume</Label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isMuted}
        />
        <VolumeDisplay>{Math.round(volume * 100)}%</VolumeDisplay>
      </SettingRow>

      <SettingRow>
        <Label>Background Music</Label>
        <CustomButton 
          onClick={handleMusicToggle}
          style={{ 
            backgroundColor: isMusicEnabled ? '#4caf50' : '#666',
            minWidth: '80px'
          }}
          disabled={isMuted}
        >
          {isMusicEnabled ? 'On' : 'Off'}
        </CustomButton>
      </SettingRow>

      <SettingRow>
        <Label>Music Volume</Label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          disabled={isMuted || !isMusicEnabled}
        />
        <VolumeDisplay>{Math.round(musicVolume * 100)}%</VolumeDisplay>
      </SettingRow>

      <SettingRow>
        <CustomButton onClick={handleTestSound} disabled={isMuted}>
          Test Drop Sound
        </CustomButton>
        <CustomButton onClick={onClose}>
          Close
        </CustomButton>
      </SettingRow>
    </SettingsContainer>
  );
};

export default FunModeSettings;