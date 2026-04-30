import React from 'react';
import { styled } from '@mui/material/styles';
import CustomButton from '../buttonComponent';
import useFunModeSettings from '../../hooks/funMode/useFunModeSettings';


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
  fontSize: '18px',
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
  // Fun Mode feature toggles
  const { monkeyModeEnabled, toggleMonkeyMode } = useFunModeSettings();

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



  return (
    <SettingsContainer>
      <h3 style={{ color: '#fff', margin: '0 0 16px 0', textAlign: 'center' }}>
        Fun Mode Settings
      </h3>

      {/* Feature toggles */}
      <SettingRow>
        <Label>Monkey Mode</Label>
        <CustomButton
          onClick={toggleMonkeyMode}
          style={{
            backgroundColor: monkeyModeEnabled ? '#4caf50' : '#ff6b6b',
            minWidth: '80px',
          }}
        >
          {monkeyModeEnabled ? 'On' : 'Off'}
        </CustomButton>
      </SettingRow>

      
     

      <SettingRow>
      
        <CustomButton onClick={onClose}>
          Close
        </CustomButton>
      </SettingRow>
    </SettingsContainer>
  );
};

export default FunModeSettings;
