import { ref } from "vue";
import type { PaceCalculation, SportActivity } from "../types/PaceRechner";

// Global state for sharing data between components
export const useGlobalState = () => {
  const currentCalculation = ref<PaceCalculation | null>(null);
  const isLoading = ref(false);

  const loadCalculation = (calculation: PaceCalculation) => {
    currentCalculation.value = calculation;
  };

  const clearCalculation = () => {
    currentCalculation.value = null;
  };

  const saveCalculation = (calculation: PaceCalculation) => {
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem("pace-calculations") || "[]");
    const existingIndex = saved.findIndex(
      (c: PaceCalculation) => c.id === calculation.id
    );

    if (existingIndex >= 0) {
      saved[existingIndex] = calculation;
    } else {
      saved.push(calculation);
    }

    localStorage.setItem("pace-calculations", JSON.stringify(saved));
  };

  const getAllCalculations = (): PaceCalculation[] => {
    return JSON.parse(localStorage.getItem("pace-calculations") || "[]");
  };

  const deleteCalculation = (id: string) => {
    const saved = JSON.parse(localStorage.getItem("pace-calculations") || "[]");
    const filtered = saved.filter((c: PaceCalculation) => c.id !== id);
    localStorage.setItem("pace-calculations", JSON.stringify(filtered));
  };

  return {
    currentCalculation,
    isLoading,
    loadCalculation,
    clearCalculation,
    saveCalculation,
    getAllCalculations,
    deleteCalculation,
  };
};
