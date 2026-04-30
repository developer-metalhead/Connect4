import React from 'react';
import ChickenAnimation from '../ChickenAnimation';
import { ChickenStatusIndicator } from './index.style';

// Chicken Animation Component
export const ChickenAnimationSection = ({ 
  isChickenAnimating, 
  chickenVoiceLine,
  chickenAction,
  isRooster
}) => {
  return (
    <ChickenAnimation
      isAnimating={isChickenAnimating}
      voiceLine={chickenVoiceLine}
      action={chickenAction}
      isRooster={isRooster}
    />
  );
};

// Chicken Status Indicators
export const ChickenStatusSection = ({ 
  chaosChickenState,
  blockedColumns
}) => {
  const { activations, isEvolved } = chaosChickenState;
  
  if (activations === 0 && blockedColumns.length === 0) {
    return null;
  }

  return (
    <ChickenStatusIndicator>
      {isEvolved ? (
        <>🔥 ROOSTER OF RAGE ACTIVE! 🔥</>
      ) : (
        <>🐔 Chicken Activations: {activations}/2</>
      )}
      {blockedColumns.length > 0 && (
        <div style={{ fontSize: "14px", marginTop: "5px" }}>
          💩 Blocked columns: {blockedColumns.map(b => `${b.columnIndex}(${b.turnsLeft})`).join(", ")}
        </div>
      )}
    </ChickenStatusIndicator>
  );
};

// Main Chaos Chicken Container
export const ChaosChickenContainer = ({ 
  chaosChickenEnabled,
  isChickenAnimating,
  chickenVoiceLine,
  chickenAction,
  chaosChickenState,
  blockedColumns
}) => {
  if (!chaosChickenEnabled) return null;

  return (
    <>
      <ChickenAnimationSection
        isChickenAnimating={isChickenAnimating}
        chickenVoiceLine={chickenVoiceLine}
        chickenAction={chickenAction}
        isRooster={chaosChickenState.isEvolved}
      />
      
      <ChickenStatusSection
        chaosChickenState={chaosChickenState}
        blockedColumns={blockedColumns}
      />
    </>
  );
};