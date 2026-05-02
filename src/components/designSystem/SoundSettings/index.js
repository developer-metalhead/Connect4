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
    isMatchMusicEnabled,
    alternateAudioEnabled,
    saveSoundSettings,
    playDropSound,
    isAudioSupported
  } = soundManager;

  const [pendingMuted, setPendingMuted] = React.useState(isMuted);
  const [pendingVolume, setPendingVolume] = React.useState(volume);
  const [pendingMusicVolume, setPendingMusicVolume] = React.useState(musicVolume);
  const [pendingMusicEnabled, setPendingMusicEnabled] = React.useState(isMusicEnabled);
  const [pendingMatchMusicEnabled, setPendingMatchMusicEnabled] = React.useState(isMatchMusicEnabled);
  const [pendingAlternateAudio, setPendingAlternateAudio] = React.useState(alternateAudioEnabled);

  const handleSave = () => {
    saveSoundSettings({
      isMuted: pendingMuted,
      volume: pendingVolume,
      musicVolume: pendingMusicVolume,
      isMusicEnabled: pendingMusicEnabled,
      isMatchMusicEnabled: pendingMatchMusicEnabled,
      alternateAudioEnabled: pendingAlternateAudio
    });
    if (soundManager?.playClickSound) soundManager.playClickSound();
    onClose();
  };

  const handleTestSound = () => {
    if (playDropSound) {
      playDropSound();
    }
  };

  // if (!isAudioSupported) {
  //   return (
  //     <SettingsContainer>
  //       <div style={{ 
  //         padding: '24px', 
  //         textAlign: 'center', 
  //         backgroundColor: 'rgba(239, 68, 68, 0.1)', 
  //         borderRadius: '12px',
  //         border: '1px solid rgba(239, 68, 68, 0.2)',
  //         marginBottom: '16px'
  //       }}>
  //         <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 600, margin: 0 }}>
  //           Audio System Error
  //         </p>
  //         <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>
  //           The audio engine failed to initialize in this browser environment.
  //         </p>
  //       </div>
  //       <Button variant="primary" fullWidth onClick={onClose} soundManager={soundManager}>
  //         Close
  //       </Button>
  //     </SettingsContainer>
  //   );
  // }

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

      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Match Music</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Plays during active matches
          </span>
        </div>
        <Button 
          variant={pendingMatchMusicEnabled ? "primary" : "secondary"}
          size="sm"
          onClick={() => setPendingMatchMusicEnabled(!pendingMatchMusicEnabled)}
          disabled={pendingMuted}
          soundManager={soundManager}
        >
          {pendingMatchMusicEnabled ? 'On' : 'Off'}
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
          disabled={pendingMuted || (!pendingMusicEnabled && !pendingMatchMusicEnabled)}
        />
      </SettingRow>

      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Alternate Audio</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Use alternate win/lose sounds
          </span>
        </div>
        <Button 
          variant={pendingAlternateAudio ? "primary" : "secondary"}
          size="sm"
          onClick={() => setPendingAlternateAudio(!pendingAlternateAudio)}
          disabled={pendingMuted}
          soundManager={soundManager}
        >
          {pendingAlternateAudio ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>

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
