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
    enableBoardShake, setEnableBoardShake, 
    shakeIntensity, setShakeIntensity,
    monkeyAnimationEnabled, setMonkeyAnimationEnabled
  } = useGameSettings();

  const handleToggleShake = () => {
    setEnableBoardShake(!enableBoardShake);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  const handleToggleMonkey = () => {
    setMonkeyAnimationEnabled(!monkeyAnimationEnabled);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  return (
    <SettingsContainer>
      <ToggleGroup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Label>Board Shake</Label>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Screen shake on piece impacts
          </span>
        </div>
        <Button 
          variant={enableBoardShake ? "primary" : "secondary"}
          size="sm"
          onClick={handleToggleShake}
          soundManager={soundManager}
        >
          {enableBoardShake ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>
      
      <div style={{
        maxHeight: enableBoardShake ? '100px' : '0',
        opacity: enableBoardShake ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: enableBoardShake ? '12px' : '0',
        paddingBottom: enableBoardShake ? '8px' : '0',
        marginBottom: enableBoardShake ? '-8px' : '0'
      }}>
        <SettingRow style={{ padding: '0 8px 8px 8px' }}>
          <LabelGroup>
            <Label>Shake Intensity</Label>
            <VolumeDisplay>{shakeIntensity}</VolumeDisplay>
          </LabelGroup>
          <Slider
            type="range"
            min="1"
            max="10"
            step="1"
            value={shakeIntensity}
            onChange={(e) => setShakeIntensity(Number(e.target.value))}
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
          variant={monkeyAnimationEnabled ? "primary" : "secondary"}
          size="sm"
          onClick={handleToggleMonkey}
          soundManager={soundManager}
        >
          {monkeyAnimationEnabled ? 'On' : 'Off'}
        </Button>
      </ToggleGroup>
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="primary" fullWidth onClick={onClose} soundManager={soundManager}>
          Done
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default GameSettings;
