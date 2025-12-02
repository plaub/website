import { ref } from "vue";
import type { PaceCalculation } from "../types/PaceRechner";

// Global state for loading calculations
const calculationToLoad = ref<PaceCalculation | null>(null);
const isLoading = ref(false);

export const useCalculationLoader = () => {
  // Load a calculation into the calculator
  const loadCalculation = (calculation: PaceCalculation) => {
    console.log("useCalculationLoader: Loading calculation:", calculation);
    calculationToLoad.value = calculation;
    isLoading.value = true;
  };

  // Get the calculation to load and mark as processed
  const getCalculationToLoad = () => {
    const calc = calculationToLoad.value;
    if (calc && isLoading.value) {
      calculationToLoad.value = null;
      isLoading.value = false;
      return calc;
    }
    return null;
  };

  // Check if there's a calculation waiting to be loaded
  const hasPendingCalculation = () => {
    return isLoading.value && calculationToLoad.value !== null;
  };

  return {
    loadCalculation,
    getCalculationToLoad,
    hasPendingCalculation,
    calculationToLoad,
    isLoading,
  };
};
