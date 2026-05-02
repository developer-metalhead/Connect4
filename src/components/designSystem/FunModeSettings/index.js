import React from 'react';
import useFunModeSettings from '../../../hooks/funMode/useFunModeSettings';
import { EMOJIS } from '../../../logic/core/coreConfig';
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
    saveFunModeSettings,
  } = useFunModeSettings();

  const [pendingMonkey, setPendingMonkey] = React.useState(monkeyModeEnabled);
  const [pendingChicken, setPendingChicken] = React.useState(chaosChickenEnabled);

  const handleSave = () => {
    saveFunModeSettings({
      monkeyModeEnabled: pendingMonkey,
      chaosChickenEnabled: pendingChicken
    });
    if (soundManager?.playClickSound) soundManager.playClickSound();
    onClose();
  };

  const handleToggleMonkey = () => {
    setPendingMonkey(!pendingMonkey);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  const handleToggleChicken = () => {
    setPendingChicken(!pendingChicken);
    if (soundManager?.playClickSound) soundManager.playClickSound();
  };

  return (
    <SettingsContainer>
      <FeatureCard active={pendingMonkey}>
        <CardHeader>
          <TitleGroup>
            <FeatureTitle>{EMOJIS.MONKEY} Monkey Mode</FeatureTitle>
            <FeatureDescription>
              Unleash the mayhem! Flip the board, scramble gravity, and swap colors when players reach 3-in-a-row.
            </FeatureDescription>
          </TitleGroup>
          <SwitchWrapper>
            <SwitchInput 
              type="checkbox" 
              checked={pendingMonkey} 
              onChange={handleToggleMonkey} 
            />
            <SwitchSlider active={pendingMonkey} />
          </SwitchWrapper>
        </CardHeader>
      </FeatureCard>

      <FeatureCard active={pendingChicken}>
        <CardHeader>
          <TitleGroup>
            <FeatureTitle>{EMOJIS.CHICKEN} Chaos Chicken</FeatureTitle>
            <FeatureDescription>
              The chicken strikes! Form a 2x2 square to block columns with poop or trigger the Rooster of Rage.
            </FeatureDescription>
          </TitleGroup>
          <SwitchWrapper>
            <SwitchInput 
              type="checkbox" 
              checked={pendingChicken} 
              onChange={handleToggleChicken} 
            />
            <SwitchSlider active={pendingChicken} />
          </SwitchWrapper>
        </CardHeader>
      </FeatureCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        <Button variant="primary" fullWidth onClick={handleSave} soundManager={soundManager}>
          Save
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default FunModeSettings;
