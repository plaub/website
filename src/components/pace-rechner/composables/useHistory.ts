import { ref } from "vue";
import type { PaceCalculation, SportActivity } from "../types/PaceRechner";
import { SportsType } from "../types/PaceRechner";
import { usePresets } from "./usePresets";

// Global state for calculations history
const calculations = ref<PaceCalculation[]>([]);
let isInitialized = false;

export const useHistory = () => {
  // Load calculations from localStorage
  const loadCalculations = () => {
    const saved = localStorage.getItem("pace-calculations");
    if (saved) {
      try {
        calculations.value = JSON.parse(saved);
        console.log(
          "Loaded calculations from localStorage:",
          calculations.value.length
        );
      } catch (error) {
        console.error("Error loading calculations:", error);
        calculations.value = [];
      }
    }
    isInitialized = true;
  };

  // Auto-initialize on first use
  if (!isInitialized && typeof window !== "undefined") {
    loadCalculations();
  }

  // Save calculations to localStorage
  const saveCalculations = () => {
    localStorage.setItem(
      "pace-calculations",
      JSON.stringify(calculations.value)
    );
  };

  // Add a new calculation
  const saveCalculation = (
    calculation: Omit<PaceCalculation, "id" | "timestamp">
  ) => {
    // Ensure we're initialized
    if (!isInitialized && typeof window !== "undefined") {
      loadCalculations();
    }

    const newCalculation: PaceCalculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    calculations.value.unshift(newCalculation); // Add at beginning
    saveCalculations();

    console.log("Saved calculation:", newCalculation);
    console.log("Total calculations in memory:", calculations.value.length);
    return newCalculation;
  };

  // Delete a calculation
  const deleteCalculation = (id: string) => {
    // Ensure we're initialized
    if (!isInitialized && typeof window !== "undefined") {
      loadCalculations();
    }

    calculations.value = calculations.value.filter((calc) => calc.id !== id);
    saveCalculations();
    console.log("Deleted calculation, remaining:", calculations.value.length);
  };

  // Create calculation object from current pace rechner state
  const createCalculationFromState = (
    name: string,
    swimDistance: number,
    swimTime: number,
    swimPace: number,
    bikeDistance: number,
    bikeTime: number,
    bikeSpeed: number,
    runDistance: number,
    runTime: number,
    runPace: number,
    t1Time: number,
    t2Time: number,
    dayTimeStart: number,
    preset: string,
    totalTime: number
  ) => {
    // Map preset to proper label
    const presetLabels: Record<string, string> = {
      sprint: "Sprint",
      olympic: "Olympic",
      md: "Mitteldistanz",
      ld: "Langdistanz",
      duathlon: "Duathlon",
    };

    // Check if it's a single sport preset
    const { getSingleSportPresets } = usePresets();
    const singleSportPresets = getSingleSportPresets();
    const singleSportPreset = singleSportPresets.find(
      (p) => p.value === preset
    );

    const activities: SportActivity[] = [];

    if (singleSportPreset) {
      // Handle single sport presets
      if (
        singleSportPreset.type === "swim" &&
        swimDistance > 0 &&
        swimTime > 0
      ) {
        activities.push({
          type: SportsType.Swim,
          distance: swimDistance,
          time: swimTime,
          paceOrSpeed: swimPace,
        });
      } else if (
        singleSportPreset.type === "bike" &&
        bikeDistance > 0 &&
        bikeTime > 0
      ) {
        activities.push({
          type: SportsType.Bike,
          distance: bikeDistance,
          time: bikeTime,
          paceOrSpeed: bikeSpeed,
        });
      } else if (
        singleSportPreset.type === "run" &&
        runDistance > 0 &&
        runTime > 0
      ) {
        activities.push({
          type: SportsType.Run,
          distance: runDistance,
          time: runTime,
          paceOrSpeed: runPace,
        });
      }

      // For single sport, no transitions
      return {
        name:
          name ||
          `${singleSportPreset.label} - ${new Date().toLocaleDateString()}`,
        activities,
        transitionTimes: {} as Record<number, number>,
        dayTimeStart,
        presetType: preset || "custom",
        totalTime,
      };
    } else {
      // Handle multi-sport presets (existing logic)
      // Add first activity (Swim or Run1 for Duathlon)
      if (preset === "duathlon") {
        activities.push({
          type: SportsType.Run,
          distance: swimDistance, // Using "swim" slot for Run1 in duathlon
          time: swimTime,
          paceOrSpeed: swimPace,
        });
      } else {
        activities.push({
          type: SportsType.Swim,
          distance: swimDistance,
          time: swimTime,
          paceOrSpeed: swimPace,
        });
      }

      // Add bike activity
      activities.push({
        type: SportsType.Bike,
        distance: bikeDistance,
        time: bikeTime,
        paceOrSpeed: bikeSpeed,
      });

      // Add final run activity
      activities.push({
        type: SportsType.Run,
        distance: runDistance,
        time: runTime,
        paceOrSpeed: runPace,
      });

      return {
        name:
          name ||
          `${
            presetLabels[preset] || "Custom"
          } - ${new Date().toLocaleDateString()}`,
        activities,
        transitionTimes: { 1: t1Time, 2: t2Time },
        dayTimeStart,
        presetType: preset || "custom",
        totalTime,
      };
    }
  };

  return {
    calculations,
    loadCalculations,
    saveCalculations,
    saveCalculation,
    deleteCalculation,
    createCalculationFromState,
  };
};
