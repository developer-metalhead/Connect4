import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "c4_fun_mode_settings_v1";
const DEFAULTS = {
  monkeyModeEnabled: true,
  // CHANGE: Ready for future features to be added here
  powerUpsEnabled: false,
  chaosChickenEnabled: true,
  monkeyAnimationEnabled: true,
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
};

const save = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
};

// CHANGE: Enhanced to support multiple fun mode features
const useFunModeSettings = () => {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    save(settings);
  }, [settings]);

  // CHANGE: Generic feature toggle function
  const toggleFeature = useCallback((featureName) => {
    setSettings((s) => ({ ...s, [featureName]: !s[featureName] }));
  }, []);

  const setFeature = useCallback((featureName, value) => {
    setSettings((s) => ({ ...s, [featureName]: !!value }));
  }, []);

  // Specific feature accessors for convenience
  const setMonkeyModeEnabled = useCallback((v) => {
    setFeature('monkeyModeEnabled', v);
  }, [setFeature]);

  const toggleMonkeyMode = useCallback(() => {
    toggleFeature('monkeyModeEnabled');
  }, [toggleFeature]);

  const setChaosChickenEnabled = useCallback((v) => {
    setSettings((s) => ({ ...s, chaosChickenEnabled: !!v }));
  }, []);

  const toggleChaosChicken = useCallback(() => {
    setSettings((s) => ({ ...s, chaosChickenEnabled: !s.chaosChickenEnabled }));
  }, []);

  return {
    settings,
    
    // Generic feature management
    toggleFeature,
    setFeature,
    
    // Direct accessors for convenience
    monkeyModeEnabled: settings.monkeyModeEnabled,
    chaosChickenEnabled: settings.chaosChickenEnabled,
    monkeyAnimationEnabled: settings.monkeyAnimationEnabled,
    setMonkeyModeEnabled,
    setChaosChickenEnabled,
    toggleMonkeyMode,
    toggleChaosChicken,
    toggleMonkeyAnimation: () => toggleFeature('monkeyAnimationEnabled'),
    
    // CHANGE: Ready for future features
    powerUpsEnabled: settings.powerUpsEnabled,
  };
};

export default useFunModeSettings;