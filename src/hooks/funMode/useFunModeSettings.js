import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "c4_fun_mode_settings_v1";
const DEFAULTS = {
  monkeyModeEnabled: true,
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

const useFunModeSettings = () => {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    save(settings);
  }, [settings]);

  const setMonkeyModeEnabled = useCallback((v) => {
    setSettings((s) => ({ ...s, monkeyModeEnabled: !!v }));
  }, []);

  const toggleMonkeyMode = useCallback(() => {
    setSettings((s) => ({ ...s, monkeyModeEnabled: !s.monkeyModeEnabled }));
  }, []);

  const setChaosChickenEnabled = useCallback((v) => {
    setSettings((s) => ({ ...s, chaosChickenEnabled: !!v }));
  }, []);

  const toggleChaosChicken = useCallback(() => {
    setSettings((s) => ({ ...s, chaosChickenEnabled: !s.chaosChickenEnabled }));
  }, []);


  return {
    settings,
    // Direct accessors for convenience
    monkeyModeEnabled: settings.monkeyModeEnabled,
    chaosChickenEnabled: settings.chaosChickenEnabled,
    setMonkeyModeEnabled,
    toggleMonkeyMode,
    setChaosChickenEnabled,
    toggleChaosChicken,
  };

};

export default useFunModeSettings;
