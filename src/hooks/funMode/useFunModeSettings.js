import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "c4_fun_mode_settings_v1";
const DEFAULTS = {
  monkeyModeEnabled: true,
  // CHANGE: Ready for future features to be added here
  powerUpsEnabled: false,
  chaosChickenEnabled: true,
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

  const saveFunModeSettings = useCallback((newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    save(updated);
  }, [settings]);

  return {
    settings,
    saveFunModeSettings,
    monkeyModeEnabled: settings.monkeyModeEnabled,
    chaosChickenEnabled: settings.chaosChickenEnabled,
    powerUpsEnabled: settings.powerUpsEnabled,
  };
};

export default useFunModeSettings;