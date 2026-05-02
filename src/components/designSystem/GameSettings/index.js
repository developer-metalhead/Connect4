import React from 'react';
import { 
  SettingsContainer, 
  SettingRow, 
  LabelGroup, 
  Label, 
  ToggleGroup,
  Slider,
  VolumeDisplay
} from '../SoundSettings/SoundSettings.style'; 
import Button from '../Button';
import { useGameSettings } from '../../../hooks/core/useGameSettings';

const GameSettings = ({ soundManager, onClose }) => {
  const { 
    enableBoardShake, 
    shakeIntensity, 
    monkeyAnimationEnabled,
    alternateAudioEnabled,
    saveGameSettings
  } = useGameSettings();

  const [pendingShake, setPendingShake] = React.useState(enableBoardShake);
  const [pendingIntensity, setPendingIntensity] = React.useState(shakeIntensity);
  const [pendingMonkey, setPendingMonkey] = React.useState(monkeyAnimationEnabled);
  const [pendingAlternateAudio, setPendingAlternateAudio] = React.useState(alternateAudioEnabled);

  const handleSave = () => {
    saveGameSettings({
      enableBoardShake: pendingShake,
      shakeIntensity: pendingIntensity,
      monkeyAnimationEnabled: pendingMonkey,
      alternateAudioEnabled: pendingAlternateAudio
    });
    if (soundManager?.playClickSound) soundManager.playClickSound();
    onClose();
  };

  return (
    <SettingsContainer>
      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>🔊 Alternate Audio</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Use fun sounds for matches
          </span>
        </div>
        <Button 
          variant={pendingAlternateAudio ? "primary" : "secondary"}
          size="sm"
          onClick={() => {
            setPendingAlternateAudio(!pendingAlternateAudio);
            if (soundManager?.playClickSound) soundManager.playClickSound();
          }}
          soundManager={soundManager}
        >
          {pendingAlternateAudio ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>

      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Board Shake</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Screen shake on piece impacts
          </span>
        </div>
        <Button 
          variant={pendingShake ? "primary" : "secondary"}
          size="sm"
          onClick={() => {
            setPendingShake(!pendingShake);
            if (soundManager?.playClickSound) soundManager.playClickSound();
          }}
          soundManager={soundManager}
        >
          {pendingShake ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>
      
      <div style={{
        maxHeight: pendingShake ? '100px' : '0',
        opacity: pendingShake ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: pendingShake ? '12px' : '0',
        paddingBottom: pendingShake ? '8px' : '0',
        marginBottom: pendingShake ? '-8px' : '0'
      }}>
        <SettingRow style={{ padding: '0 8px 8px 8px' }}>
          <LabelGroup>
            <Label>Shake Intensity</Label>
            <VolumeDisplay>{pendingIntensity}</VolumeDisplay>
          </LabelGroup>
          <Slider
            type="range"
            min="1"
            max="10"
            step="1"
            value={pendingIntensity}
            onChange={(e) => setPendingIntensity(Number(e.target.value))}
          />
        </SettingRow>
      </div>

      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>🎥 Surrender Animation</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Play animation when surrendering
          </span>
        </div>
        <Button 
          variant={pendingMonkey ? "primary" : "secondary"}
          size="sm"
          onClick={() => {
            setPendingMonkey(!pendingMonkey);
            if (soundManager?.playClickSound) soundManager.playClickSound();
          }}
          soundManager={soundManager}
        >
          {pendingMonkey ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="primary" fullWidth onClick={handleSave} soundManager={soundManager}>
          Save
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default GameSettings;
