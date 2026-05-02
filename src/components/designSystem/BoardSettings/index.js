import React from 'react';
import { 
  SettingsContainer, 
  SettingRow, 
  LabelGroup, 
  Label, 
  ToggleGroup,
  Slider,
  VolumeDisplay
} from '../SoundSettings/SoundSettings.style'; // Reuse the styled components
import Button from '../Button';
import { useBoardSettings } from '../../../hooks/core/useBoardSettings';

const BoardSettings = ({ soundManager, onClose }) => {
  const { enableBoardShake, setEnableBoardShake, shakeIntensity, setShakeIntensity } = useBoardSettings();

  const handleToggleShake = () => {
    setEnableBoardShake(!enableBoardShake);
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
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="primary" fullWidth onClick={onClose}>
          Done
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default BoardSettings;
