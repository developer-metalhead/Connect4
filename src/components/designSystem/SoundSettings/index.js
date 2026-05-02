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
    volume,
    musicVolume,
    isMusicEnabled,
    saveSoundSettings,
    playDropSound,
    isAudioSupported
  } = soundManager;

  const [pendingMuted, setPendingMuted] = React.useState(isMuted);
  const [pendingVolume, setPendingVolume] = React.useState(volume);
  const [pendingMusicVolume, setPendingMusicVolume] = React.useState(musicVolume);
  const [pendingMusicEnabled, setPendingMusicEnabled] = React.useState(isMusicEnabled);

  const handleSave = () => {
    saveSoundSettings({
      isMuted: pendingMuted,
      volume: pendingVolume,
      musicVolume: pendingMusicVolume,
      isMusicEnabled: pendingMusicEnabled
    });
    if (soundManager?.playSound) soundManager.playSound('coinsfalling');
    onClose();
  };

  const handleTestSound = () => {
    // Temporarily play a sound using pending settings for preview
    if (playDropSound) {
      playDropSound();
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
          variant={pendingMuted ? "danger" : "primary"}
          size="sm"
          onClick={() => setPendingMuted(!pendingMuted)}
          soundManager={soundManager}
        >
          {pendingMuted ? 'Muted' : 'Enabled'}
        </Button>
      </ToggleGroup>
      
      <SettingRow>
        <LabelGroup>
          <Label>SFX Volume</Label>
          <VolumeDisplay>{Math.round(pendingVolume * 100)}%</VolumeDisplay>
        </LabelGroup>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={pendingVolume}
          onChange={(e) => setPendingVolume(parseFloat(e.target.value))}
          disabled={pendingMuted}
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
          variant={pendingMusicEnabled ? "primary" : "secondary"}
          size="sm"
          onClick={() => setPendingMusicEnabled(!pendingMusicEnabled)}
          disabled={pendingMuted}
          soundManager={soundManager}
        >
          {pendingMusicEnabled ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>

      <SettingRow>
        <LabelGroup>
          <Label>Music Volume</Label>
          <VolumeDisplay>{Math.round(pendingMusicVolume * 100)}%</VolumeDisplay>
        </LabelGroup>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={pendingMusicVolume}
          onChange={(e) => setPendingMusicVolume(parseFloat(e.target.value))}
          disabled={pendingMuted || !pendingMusicEnabled}
        />
      </SettingRow>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="outline" fullWidth onClick={handleTestSound} disabled={pendingMuted} soundManager={soundManager}>
          Test
        </Button>
        <Button variant="primary" fullWidth onClick={handleSave} soundManager={soundManager}>
          Save
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default SoundSettings;
