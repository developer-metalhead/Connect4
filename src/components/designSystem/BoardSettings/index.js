import React from 'react';
import { 
  SettingsContainer, 
  SettingRow, 
  LabelGroup, 
  Label, 
  ToggleGroup
} from '../SoundSettings/SoundSettings.style'; // Reuse the styled components
import Button from '../Button';
import { useBoardSettings } from '../../../hooks/core/useBoardSettings';

const BoardSettings = ({ soundManager, onClose }) => {
  const { enableBoardShake, setEnableBoardShake } = useBoardSettings();

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
      
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="primary" fullWidth onClick={onClose}>
          Done
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default BoardSettings;
