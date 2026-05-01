import React from 'react';
import useFunModeSettings from '../../../hooks/funMode/useFunModeSettings';
import {
  SettingsContainer,
  FeatureCard,
  CardHeader,
  TitleGroup,
  FeatureTitle,
  FeatureDescription,
  SwitchWrapper,
  SwitchInput,
  SwitchSlider
} from './FunModeSettings.style';
import Button from '../Button';

const FunModeSettings = ({ soundManager, onClose }) => {
  const { 
    monkeyModeEnabled, 
    chaosChickenEnabled, 
    toggleMonkeyMode, 
    toggleChaosChicken 
  } = useFunModeSettings();

  const handleToggle = (handler) => {
    handler();
    if (soundManager?.playClickSound) {
      soundManager.playClickSound();
    }
  };

  return (
    <SettingsContainer>
      <FeatureCard active={monkeyModeEnabled}>
        <CardHeader>
          <TitleGroup>
            <FeatureTitle>🐒 Monkey Mode</FeatureTitle>
            <FeatureDescription>
              Unleash the mayhem! Flip the board, scramble gravity, and swap colors when players reach 3-in-a-row.
            </FeatureDescription>
          </TitleGroup>
          <SwitchWrapper>
            <SwitchInput 
              type="checkbox" 
              checked={monkeyModeEnabled} 
              onChange={() => handleToggle(toggleMonkeyMode)} 
            />
            <SwitchSlider active={monkeyModeEnabled} />
          </SwitchWrapper>
        </CardHeader>
      </FeatureCard>

      <FeatureCard active={chaosChickenEnabled}>
        <CardHeader>
          <TitleGroup>
            <FeatureTitle>🐔 Chaos Chicken</FeatureTitle>
            <FeatureDescription>
              The chicken strikes! Form a 2x2 square to block columns with poop or trigger the Rooster of Rage.
            </FeatureDescription>
          </TitleGroup>
          <SwitchWrapper>
            <SwitchInput 
              type="checkbox" 
              checked={chaosChickenEnabled} 
              onChange={() => handleToggle(toggleChaosChicken)} 
            />
            <SwitchSlider active={chaosChickenEnabled} />
          </SwitchWrapper>
        </CardHeader>
      </FeatureCard>

      <div style={{ marginTop: '12px' }}>
        <Button variant="primary" fullWidth onClick={onClose}>
          Save & Close
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default FunModeSettings;
