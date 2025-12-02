import { ref, computed } from "vue";

// Settings interface
interface AppSettings {
  defaultCompetitionType: string;
  defaultStartTime: number;
  units: "metric" | "imperial";
  // Current calculation values
  currentCalculation?: {
    name: string;
    dayTimeStart: number;
    swimDistance: number;
    swimTime: number;
    swimPace: number;
    bikeDistance: number;
    bikeTime: number;
    bikeSpeed: number;
    runDistance: number;
    runTime: number;
    runPace: number;
    t1Time: number;
    t2Time: number;
    presetType: string;
  };
}

// Default settings
const defaultSettings: AppSettings = {
  defaultCompetitionType: "Olympic",
  defaultStartTime: 25200, // 07:00:00 in seconds
  units: "metric",
};

// Global reactive settings
const settings = ref<AppSettings>({ ...defaultSettings });

export const useSettings = () => {
  // Load settings from localStorage
  const loadSettings = async () => {
    const saved = localStorage.getItem("app-settings");
    console.log("Loading settings from localStorage:", saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        settings.value = { ...defaultSettings, ...parsed };
        console.log("Loaded settings:", settings.value);
      } catch (error) {
        console.error("Error loading settings:", error);
        settings.value = { ...defaultSettings };
      }
    } else {
      console.log("No saved settings found, using defaults:", defaultSettings);
      settings.value = { ...defaultSettings };
    }
    // Small delay to ensure settings are fully applied
    await new Promise((resolve) => setTimeout(resolve, 10));
  };

  // Save settings to localStorage
  const saveSettings = () => {
    console.log("Saving settings:", settings.value);
    localStorage.setItem("app-settings", JSON.stringify(settings.value));
  };

  // Update specific setting
  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    settings.value[key] = value;
    saveSettings();
  };

  // Reset all settings
  const resetSettings = () => {
    settings.value = { ...defaultSettings };
    localStorage.removeItem("app-settings");
  };

  // Computed getters
  const defaultCompetitionType = computed(
    () => settings.value.defaultCompetitionType
  );
  const defaultStartTime = computed(() => settings.value.defaultStartTime);
  const units = computed(() => settings.value.units);

  // Save current calculation to settings
  const saveCurrentCalculation = (calculationData: any) => {
    console.log("Saving current calculation to settings:", calculationData);
    settings.value.currentCalculation = {
      name: calculationData.name || "Geladene Berechnung",
      dayTimeStart: calculationData.dayTimeStart,
      swimDistance: calculationData.swimDistance,
      swimTime: calculationData.swimTime,
      swimPace: calculationData.swimPace,
      bikeDistance: calculationData.bikeDistance,
      bikeTime: calculationData.bikeTime,
      bikeSpeed: calculationData.bikeSpeed,
      runDistance: calculationData.runDistance,
      runTime: calculationData.runTime,
      runPace: calculationData.runPace,
      t1Time: calculationData.t1Time,
      t2Time: calculationData.t2Time,
      presetType: calculationData.presetType,
    };
    saveSettings();
  };

  // Load current calculation from settings
  const loadCurrentCalculation = () => {
    console.log(
      "Loading current calculation from settings:",
      settings.value.currentCalculation
    );
    return settings.value.currentCalculation;
  };

  // Clear current calculation from settings
  const clearCurrentCalculation = () => {
    console.log("Clearing current calculation from settings");
    settings.value.currentCalculation = undefined;
    saveSettings();
  };

  return {
    settings,
    loadSettings,
    saveSettings,
    updateSetting,
    resetSettings,
    // Calculation management
    saveCurrentCalculation,
    loadCurrentCalculation,
    clearCurrentCalculation,
    // Computed getters
    defaultCompetitionType,
    defaultStartTime,
    units,
  };
};
