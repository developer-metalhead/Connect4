import React from 'react';
import { 
  SettingsContainer, 
  SettingRow, 
  LabelGroup, 
  Label, 
  Slider, 
  VolumeDisplay,
  ToggleGroup
} from './SoundSettings.style';
import Button from '../Button';

const SoundSettings = ({ soundManager, onClose }) => {
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
  };

  const handleTestSound = () => {
    if (soundManager.playDropSound) {
      soundManager.playDropSound();
    }
  };

  if (!isAudioSupported) {
    return (
      <SettingsContainer>
        <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '14px' }}>
          Audio is not supported in this browser environment.
        </p>
        <Button variant="primary" fullWidth onClick={onClose} soundManager={soundManager}>
          Close
        </Button>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Master Audio</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Toggle all sounds on/off
          </span>
        </div>
        <Button 
          variant={isMuted ? "danger" : "primary"}
          size="sm"
          onClick={handleMuteToggle}
          soundManager={soundManager}
        >
          {isMuted ? 'Muted' : 'Enabled'}
        </Button>
      </ToggleGroup>
      
      <SettingRow>
        <LabelGroup>
          <Label>SFX Volume</Label>
          <VolumeDisplay>{Math.round(volume * 100)}%</VolumeDisplay>
        </LabelGroup>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isMuted}
        />
      </SettingRow>

      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Background Music</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Ambient soundtrack
          </span>
        </div>
        <Button 
          variant={isMusicEnabled ? "primary" : "secondary"}
          size="sm"
          onClick={handleMusicToggle}
          disabled={isMuted}
          soundManager={soundManager}
        >
          {isMusicEnabled ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>

      <SettingRow>
        <LabelGroup>
          <Label>Music Volume</Label>
          <VolumeDisplay>{Math.round(musicVolume * 100)}%</VolumeDisplay>
        </LabelGroup>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          disabled={isMuted || !isMusicEnabled}
        />
      </SettingRow>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Button variant="outline" fullWidth onClick={handleTestSound} disabled={isMuted} soundManager={soundManager}>
          Test Sound
        </Button>
        <Button variant="primary" fullWidth onClick={onClose} soundManager={soundManager}>
          Done
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default SoundSettings;
