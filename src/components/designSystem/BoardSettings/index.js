import React from 'react';
import { 
  SettingsContainer, 
  LabelGroup, 
  Label, 
} from '../SoundSettings/SoundSettings.style'; 
import Button from '../Button';

const BoardSettings = ({ soundManager, onClose }) => {
  return (
    <SettingsContainer>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        padding: '16px', 
        backgroundColor: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: '12px', 
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '16px'
      }}>
        <LabelGroup>
          <Label>Board Skin</Label>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 700,
            padding: '2px 8px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            color: '#3b82f6',
            borderRadius: '10px',
            textTransform: 'uppercase'
          }}>Coming Soon</span>
        </LabelGroup>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
          Customize your board with different themes, materials, and colors.
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
        <Button variant="primary" fullWidth onClick={onClose} soundManager={soundManager}>
          Save
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default BoardSettings;

