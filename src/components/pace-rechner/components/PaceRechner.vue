<template>
  <div class="toolbar">
    <div>
      <label> Um wieviel Uhr startest du? </label>
      <DurationPicker
        v-model="dayTimeStart"
        @update:modelValue="onChangeDayTimeStart"
        uKey="daytimeStart"
        backgroundColor="#6b7280"
      />
    </div>

    <div style="display: flex; align-items: center; gap: 8px">
      <select
        name=""
        id="presets"
        @change="handlePresetChange"
        v-model="preset"
        class="rounded select"
      >
        <option value="">Vorlagen</option>
        <option
          v-if="loadedHistoryName"
          :value="preset"
          disabled
          style="font-weight: bold; color: #2563eb"
        >
          📋 {{ loadedHistoryName }}
        </option>

        <!-- Triathlon Presets -->
        <optgroup label="🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon & Duathlon">
          <option value="sprint">Sprint</option>
          <option value="olympic">Olympisch</option>
          <option value="md">Mitteldistanz</option>
          <option value="ld">Langdistanz</option>
          <option value="duathlon">Duathlon</option>
        </optgroup>

        <!-- Einzelsport Presets -->
        <optgroup label="🏊 Schwimmen">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'swim'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>

        <optgroup label="🚴 Radfahren">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'bike'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>

        <optgroup label="🏃 Laufen">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'run'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>

        <optgroup label="🚣 Rudern">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'row'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>

        <optgroup label="🥾 Wandern">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'hike'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>

        <optgroup label="🚶 Gehen">
          <option
            v-for="sportPreset in singleSportPresets.filter(
              (p) => p.type === 'walk'
            )"
            :key="sportPreset.value"
            :value="sportPreset.value"
          >
            {{ sportPreset.label }}
          </option>
        </optgroup>
      </select>
      <button
        v-if="loadedHistoryName"
        @click="clearLoadedHistory"
        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
        title="Geladene Berechnung löschen und zu Standardwerten zurückkehren"
      >
        ✕
      </button>
    </div>
  </div>

  <div class="wrapper">
    <div v-if="showSwimForm" class="pace-rechner">
      <pace-rechner-form
        :key="`swim-${componentKey}`"
        v-model:distance="swimDistance"
        v-model:time="swimTime"
        v-model:pace="swimPace"
        :backgroundColor="'#74b9ff'"
        :title="preset === 'duathlon' ? 'Run 1' : 'Swim'"
        :paceUnit="preset === 'duathlon' ? PaceUnit.Run : PaceUnit.Swim"
        :distanceUnit="
          preset === 'duathlon' ? DistanceUnit.Run : DistanceUnit.Swim
        "
      />
    </div>

    <div
      v-if="showTransitions && showSwimForm && showBikeForm"
      class="pace-rechner"
    >
      <PaceRechnerTransition
        :key="`t1-${componentKey}`"
        v-model:time="t1Time"
      />
    </div>

    <div v-if="showBikeForm" class="pace-rechner">
      <pace-rechner-form
        :key="`bike-${componentKey}`"
        v-model:distance="bikeDistance"
        v-model:time="bikeTime"
        v-model:speed="bikeSpeed"
        :backgroundColor="'#00b894'"
        color="#fefefe"
        title="Bike"
        :speedUnit="SpeedUnit.Bike"
        :paceType="PaceType.Speed"
        :distanceUnit="DistanceUnit.Bike"
      />
    </div>

    <div
      v-if="showTransitions && showBikeForm && showRunForm"
      class="pace-rechner"
    >
      <PaceRechnerTransition
        :key="`t2-${componentKey}`"
        v-model:time="t2Time"
      />
    </div>

    <div v-if="showRunForm" class="pace-rechner">
      <pace-rechner-form
        :key="`run-${componentKey}`"
        v-model:distance="runDistance"
        v-model:time="runTime"
        v-model:pace="runPace"
        :backgroundColor="'#fab1a0'"
        color="#2d3436"
        :title="preset === 'duathlon' ? 'Run 2' : 'Run'"
        :paceUnit="PaceUnit.Run"
        :paceType="PaceType.Pace"
        :distanceUnit="DistanceUnit.Run"
      />
    </div>

    <div v-if="showRowForm" class="pace-rechner">
      <pace-rechner-form
        :key="`row-${componentKey}`"
        v-model:distance="rowDistance"
        v-model:time="rowTime"
        v-model:speed="rowSpeed"
        :backgroundColor="'#0984e3'"
        color="#ffffff"
        title="Rudern"
        :speedUnit="SpeedUnit.Bike"
        :paceType="PaceType.Speed"
        :distanceUnit="DistanceUnit.Run"
      />
    </div>

    <div v-if="showHikeForm" class="pace-rechner">
      <pace-rechner-form
        :key="`hike-${componentKey}`"
        v-model:distance="hikeDistance"
        v-model:time="hikeTime"
        v-model:pace="hikePace"
        :backgroundColor="'#6c5ce7'"
        color="#ffffff"
        title="Wandern"
        :paceUnit="PaceUnit.Run"
        :paceType="PaceType.Pace"
        :distanceUnit="DistanceUnit.Run"
      />
    </div>

    <div v-if="showWalkForm" class="pace-rechner">
      <pace-rechner-form
        :key="`walk-${componentKey}`"
        v-model:distance="walkDistance"
        v-model:time="walkTime"
        v-model:pace="walkPace"
        :backgroundColor="'#00b894'"
        color="#ffffff"
        title="Gehen"
        :paceUnit="PaceUnit.Run"
        :paceType="PaceType.Pace"
        :distanceUnit="DistanceUnit.Run"
      />
    </div>
  </div>

  <div class="wrapper">
    <PaceRechnerSummary
      :swimTimeString="swimTimeString"
      :bikeTimeString="bikeTimeString"
      :runTimeString="runTimeString"
      :rowTimeString="rowTimeString"
      :hikeTimeString="hikeTimeString"
      :walkTimeString="walkTimeString"
      :t1TimeString="t1TimeString"
      :t2TimeString="t2TimeString"
      :totalTimeString="totalTimeString"
      :swimCumulativeTimeString="swimCumulativeTimeString"
      :t1CumulativeTimeString="t1CumulativeTimeString"
      :bikeCumulativeTimeString="bikeCumulativeTimeString"
      :t2CumulativeTimeString="t2CumulativeTimeString"
      :dayTimeStartString="dayTimeStartString"
      :totalTimeAfterSwimString="totalTimeAfterSwimString"
      :timeAfterT1String="timeAfterT1String"
      :totalTimeAfterBikeString="totalTimeAfterBikeString"
      :timeAfterT2String="timeAfterT2String"
      :dayTimeFinish="dayTimeFinish"
      :bikeQuarter1Km="bikeQuarter1Km"
      :bikeHalfKm="bikeHalfKm"
      :bikeThreeQuarterKm="bikeThreeQuarterKm"
      :runQuarter1Km="runQuarter1Km"
      :runHalfKm="runHalfKm"
      :runThreeQuarterKm="runThreeQuarterKm"
      :bike25TimeString="bike25TimeString"
      :bike50TimeString="bike50TimeString"
      :bike75TimeString="bike75TimeString"
      :run25TimeString="run25TimeString"
      :run50TimeString="run50TimeString"
      :run75TimeString="run75TimeString"
      :bike25CumulativeTimeString="bike25CumulativeTimeString"
      :bike50CumulativeTimeString="bike50CumulativeTimeString"
      :bike75CumulativeTimeString="bike75CumulativeTimeString"
      :run25CumulativeTimeString="run25CumulativeTimeString"
      :run50CumulativeTimeString="run50CumulativeTimeString"
      :run75CumulativeTimeString="run75CumulativeTimeString"
      :clockTimeBike25String="clockTimeBike25String"
      :clockTimeBike50String="clockTimeBike50String"
      :clockTimeBike75String="clockTimeBike75String"
      :clockTimeRun25String="clockTimeRun25String"
      :clockTimeRun50String="clockTimeRun50String"
      :clockTimeRun75String="clockTimeRun75String"
      :preset="preset"
    />
  </div>

  <!-- Save Button -->
  <div class="wrapper mt-4">
    <div class="save-section">
      <div class="save-controls">
        <input
          v-model="calculationName"
          type="text"
          placeholder="Name für die Berechnung (optional)"
          class="save-input"
        />
        <button
          @click="saveCurrentCalculation"
          :disabled="!hasValidCalculation"
          :class="['btn', hasValidCalculation ? 'btn-primary' : 'btn-disabled']"
        >
          💾 Berechnung speichern
        </button>
      </div>
      <p v-if="saveMessage" class="save-message">
        {{ saveMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";
import DurationPicker from "./DurationPicker.vue";
import PaceRechnerTransition from "./PaceRechnerTransition.vue";
import PaceRechnerForm from "./PaceRechnerForm.vue";
import PaceRechnerSummary from "./PaceRechnerSummary.vue";
import {
  SpeedUnit,
  PaceUnit,
  PaceType,
  DistanceUnit,
} from "../types/PaceRechner";
import { usePaceCalculations } from "../composables/usePaceCalculations";
import { useSettings } from "../composables/useSettings";
import { useHistory } from "../composables/useHistory";
import { useCalculationLoader } from "../composables/useCalculationLoader";
import { usePresets } from "../composables/usePresets";

const preset = ref("");
const {
  settings,
  loadSettings,
  updateSetting,
  saveCurrentCalculation: saveCalculationToSettings,
  loadCurrentCalculation,
  clearCurrentCalculation,
} = useSettings();
const { saveCalculation, createCalculationFromState } = useHistory();
const { getCalculationToLoad, hasPendingCalculation } = useCalculationLoader();

// Save functionality
const calculationName = ref("");
const saveMessage = ref("");

// Current loaded history name
const loadedHistoryName = ref("");

// Force re-render key
const componentKey = ref(0);

// Single sport presets
const { getSingleSportPresets } = usePresets();
const singleSportPresets = computed(() => getSingleSportPresets());

// Check if current preset is a single sport
const currentSportPreset = computed(() => {
  return singleSportPresets.value.find((p) => p.value === preset.value);
});

// Show/hide forms based on preset
const showSwimForm = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "swim";
});

const showBikeForm = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "bike";
});

const showRunForm = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "run";
});

const showRowForm = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "row";
});

const showHikeForm = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "hike";
});

const showWalkForm = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "walk";
});

const showTransitions = computed(() => {
  return !currentSportPreset.value; // Hide transitions for single sports
});

const {
  // Base data
  dayTimeStart,
  swimDistance,
  swimTime,
  swimPace,
  bikeDistance,
  bikeTime,
  bikeSpeed,
  runDistance,
  runTime,
  runPace,
  rowDistance,
  rowTime,
  rowSpeed,
  hikeDistance,
  hikeTime,
  hikePace,
  walkDistance,
  walkTime,
  walkPace,
  t1Time,
  t2Time,

  // All computed values for summary
  swimTimeString,
  bikeTimeString,
  runTimeString,
  rowTimeString,
  hikeTimeString,
  walkTimeString,
  t1TimeString,
  t2TimeString,
  totalTime,
  totalTimeString,
  swimCumulativeTimeString,
  t1CumulativeTimeString,
  bikeCumulativeTimeString,
  t2CumulativeTimeString,
  dayTimeStartString,
  totalTimeAfterSwimString,
  timeAfterT1String,
  totalTimeAfterBikeString,
  timeAfterT2String,
  dayTimeFinish,
  bikeQuarter1Km,
  bikeHalfKm,
  bikeThreeQuarterKm,
  runQuarter1Km,
  runHalfKm,
  runThreeQuarterKm,
  bike25TimeString,
  bike50TimeString,
  bike75TimeString,
  run25TimeString,
  run50TimeString,
  run75TimeString,
  bike25CumulativeTimeString,
  bike50CumulativeTimeString,
  bike75CumulativeTimeString,
  run25CumulativeTimeString,
  run50CumulativeTimeString,
  run75CumulativeTimeString,
  clockTimeBike25String,
  clockTimeBike50String,
  clockTimeBike75String,
  clockTimeRun25String,
  clockTimeRun50String,
  clockTimeRun75String,

  // Functions
  onChangeDayTimeStart,
  setPreset,
} = usePaceCalculations();

const handlePresetChange = () => {
  // Check if it's a triathlon preset
  if (["sprint", "olympic", "md", "ld", "duathlon"].includes(preset.value)) {
    setPreset(preset.value);
  } else {
    // It's a single sport preset
    const selectedSportPreset = singleSportPresets.value.find(
      (p) => p.value === preset.value
    );
    if (selectedSportPreset) {
      // Reset all values first
      swimDistance.value = selectedSportPreset.swimDistance || 0;
      swimTime.value = 0;
      swimPace.value = selectedSportPreset.swimPace || 120;

      bikeDistance.value = selectedSportPreset.bikeDistance || 0;
      bikeTime.value = 0;
      bikeSpeed.value = selectedSportPreset.bikeSpeed || 25;

      runDistance.value = selectedSportPreset.runDistance || 0;
      runTime.value = 0;
      runPace.value = selectedSportPreset.runPace || 300;

      // Set new sport values
      rowDistance.value = selectedSportPreset.rowDistance || 0;
      rowTime.value = 0;
      rowSpeed.value = selectedSportPreset.rowSpeed || 12;

      hikeDistance.value = selectedSportPreset.hikeDistance || 0;
      hikeTime.value = 0;
      hikePace.value = selectedSportPreset.hikePace || 480;

      walkDistance.value = selectedSportPreset.walkDistance || 0;
      walkTime.value = 0;
      walkPace.value = selectedSportPreset.walkPace || 420;

      // Reset transition times for single sports
      t1Time.value = 0;
      t2Time.value = 0;

      // Calculate times based on pace/speed
      if (
        selectedSportPreset.type === "swim" &&
        selectedSportPreset.swimDistance > 0 &&
        selectedSportPreset.swimPace
      ) {
        swimTime.value = Math.round(
          (selectedSportPreset.swimDistance / 100.0) *
            selectedSportPreset.swimPace
        );
      }
      if (
        selectedSportPreset.type === "bike" &&
        selectedSportPreset.bikeDistance > 0 &&
        selectedSportPreset.bikeSpeed
      ) {
        bikeTime.value = Math.round(
          (selectedSportPreset.bikeDistance / selectedSportPreset.bikeSpeed) *
            3600
        );
      }
      if (
        selectedSportPreset.type === "run" &&
        selectedSportPreset.runDistance > 0 &&
        selectedSportPreset.runPace
      ) {
        runTime.value = Math.round(
          (selectedSportPreset.runDistance / 1000.0) *
            selectedSportPreset.runPace
        );
      }
      if (
        selectedSportPreset.type === "row" &&
        selectedSportPreset.rowDistance > 0 &&
        selectedSportPreset.rowSpeed
      ) {
        rowTime.value = Math.round(
          (selectedSportPreset.rowDistance /
            1000.0 /
            selectedSportPreset.rowSpeed) *
            3600
        );
      }
      if (
        selectedSportPreset.type === "hike" &&
        selectedSportPreset.hikeDistance > 0 &&
        selectedSportPreset.hikePace
      ) {
        hikeTime.value = Math.round(
          (selectedSportPreset.hikeDistance / 1000.0) *
            selectedSportPreset.hikePace
        );
      }
      if (
        selectedSportPreset.type === "walk" &&
        selectedSportPreset.walkDistance > 0 &&
        selectedSportPreset.walkPace
      ) {
        walkTime.value = Math.round(
          (selectedSportPreset.walkDistance / 1000.0) *
            selectedSportPreset.walkPace
        );
      }
    }
  }
};

// Clear loaded history and use default presets
const clearLoadedHistory = () => {
  clearCurrentCalculation();
  loadedHistoryName.value = "";

  // Reset to default values instead of page reload
  dayTimeStart.value = settings.value.defaultStartTime || 25200;
  onChangeDayTimeStart(dayTimeStart.value);

  // Reset all sport values to default
  swimDistance.value = 750;
  swimTime.value = 0;
  swimPace.value = 120;

  bikeDistance.value = 20;
  bikeTime.value = 0;
  bikeSpeed.value = 25;

  runDistance.value = 5000;
  runTime.value = 0;
  runPace.value = 300;

  // Reset new sports to default values
  rowDistance.value = 2000;
  rowTime.value = 0;
  rowSpeed.value = 12;

  hikeDistance.value = 10000;
  hikeTime.value = 0;
  hikePace.value = 480;

  walkDistance.value = 5000;
  walkTime.value = 0;
  walkPace.value = 420;

  t1Time.value = 300;
  t2Time.value = 300;

  // Reset preset to default
  const competitionMap: Record<string, string> = {
    Sprint: "sprint",
    Olympic: "olympic",
    "Middle Distance": "md",
    "Long Distance": "ld",
    Duathlon: "duathlon",
  };

  const mappedPreset = competitionMap[settings.value.defaultCompetitionType];
  if (mappedPreset) {
    preset.value = mappedPreset;
    setPreset(mappedPreset);
  } else {
    preset.value = "";
  }

  // Force component re-render
  componentKey.value += 1;
};

// Apply settings on component mount
onMounted(async () => {
  // Load settings first
  await loadSettings();
  console.log("PaceRechner: Loaded settings:", settings.value);

  // Check if we have a saved current calculation
  const savedCalculation = loadCurrentCalculation();

  if (savedCalculation) {
    console.log(
      "PaceRechner: Loading saved calculation from settings:",
      savedCalculation
    );

    // Apply saved calculation values
    dayTimeStart.value = savedCalculation.dayTimeStart;
    onChangeDayTimeStart(savedCalculation.dayTimeStart);

    swimDistance.value = savedCalculation.swimDistance;
    swimTime.value = savedCalculation.swimTime;
    swimPace.value = savedCalculation.swimPace;

    bikeDistance.value = savedCalculation.bikeDistance;
    bikeTime.value = savedCalculation.bikeTime;
    bikeSpeed.value = savedCalculation.bikeSpeed;

    runDistance.value = savedCalculation.runDistance;
    runTime.value = savedCalculation.runTime;
    runPace.value = savedCalculation.runPace;

    t1Time.value = savedCalculation.t1Time;
    t2Time.value = savedCalculation.t2Time;

    // Set loaded history name
    loadedHistoryName.value = savedCalculation.name || "Geladene Berechnung";

    // Set preset with proper timing
    await nextTick();

    // Try to use the saved presetType first, otherwise fall back to settings
    let presetToSet = savedCalculation.presetType;
    if (!presetToSet) {
      // Fall back to deriving preset from settings
      const competitionMap: Record<string, string> = {
        Sprint: "sprint",
        Olympic: "olympic",
        "Middle Distance": "md",
        "Long Distance": "ld",
        Duathlon: "duathlon",
      };
      presetToSet = competitionMap[settings.value.defaultCompetitionType];
    }

    preset.value = presetToSet || "";
    console.log(
      "PaceRechner: Set preset to:",
      presetToSet,
      "preset.value is now:",
      preset.value
    );
  } else {
    console.log("PaceRechner: No saved calculation, using default settings");

    // Set default start time from settings
    dayTimeStart.value = settings.value.defaultStartTime;
    onChangeDayTimeStart(settings.value.defaultStartTime);

    // Handle pending calculations if any
    if (hasPendingCalculation()) {
      const pendingCalculation = getCalculationToLoad();
      if (pendingCalculation) {
        console.log("PaceRechner: Found pending calculation, loading it");
        await loadCalculationData(pendingCalculation);
        return; // Exit early as calculation is now loaded
      }
    }

    // Set default competition type from settings
    const competitionMap: Record<string, string> = {
      Sprint: "sprint",
      Olympic: "olympic",
      "Middle Distance": "md",
      "Long Distance": "ld",
      Duathlon: "duathlon",
    };

    const mappedPreset = competitionMap[settings.value.defaultCompetitionType];
    if (mappedPreset) {
      await nextTick();
      preset.value = mappedPreset;
      setPreset(mappedPreset);
      console.log("PaceRechner: Applied default preset:", mappedPreset);
    }
  }
});

// Watch for calculation loading requests (simplified)
watch(
  () => hasPendingCalculation(),
  (pending) => {
    if (pending) {
      const calculation = getCalculationToLoad();
      if (calculation) {
        console.log("PaceRechner: Loading calculation via watch:", calculation);
        loadCalculationData(calculation);
      }
    }
  }
);

// Computed for save functionality
const hasValidCalculation = computed(() => {
  if (currentSportPreset.value) {
    // For single sport presets, check only the relevant sport
    if (currentSportPreset.value.type === "swim") {
      return swimTime.value > 0 && swimDistance.value > 0;
    } else if (currentSportPreset.value.type === "bike") {
      return bikeTime.value > 0 && bikeDistance.value > 0;
    } else if (currentSportPreset.value.type === "run") {
      return runTime.value > 0 && runDistance.value > 0;
    }
  } else {
    // For multi-sport presets, use existing logic
    return (
      totalTime.value > 0 &&
      (swimTime.value > 0 || bikeTime.value > 0 || runTime.value > 0)
    );
  }
  return false;
});

// Save current calculation
const saveCurrentCalculation = () => {
  if (!hasValidCalculation.value) return;

  const calculation = createCalculationFromState(
    calculationName.value,
    swimDistance.value,
    swimTime.value,
    swimPace.value,
    bikeDistance.value,
    bikeTime.value,
    bikeSpeed.value,
    runDistance.value,
    runTime.value,
    runPace.value,
    t1Time.value,
    t2Time.value,
    dayTimeStart.value,
    preset.value,
    totalTime.value
  );

  saveCalculation(calculation);

  // Show success message
  saveMessage.value = "Berechnung erfolgreich gespeichert!";
  calculationName.value = "";

  // Clear message after 3 seconds
  setTimeout(() => {
    saveMessage.value = "";
  }, 3000);
};

// Load calculation from history - directly apply to current state
const loadCalculationData = async (calculation: any) => {
  console.log("PaceRechner: Loading calculation data:", calculation);

  if (!calculation || !calculation.activities) return;

  try {
    // Directly apply the calculation values to the current state
    dayTimeStart.value = calculation.dayTimeStart || 25200;
    onChangeDayTimeStart(dayTimeStart.value);

    // Apply swim data (if available)
    if (calculation.activities[0]) {
      swimDistance.value = calculation.activities[0].distance || 750;
      swimTime.value = calculation.activities[0].time || 900;
      swimPace.value = calculation.activities[0].paceOrSpeed || 120;
    }

    // Apply bike data (if available)
    if (calculation.activities[1]) {
      bikeDistance.value = calculation.activities[1].distance || 20;
      bikeTime.value = calculation.activities[1].time || 2880;
      bikeSpeed.value = calculation.activities[1].paceOrSpeed || 25;
    }

    // Apply run data (if available)
    if (calculation.activities[2]) {
      runDistance.value = calculation.activities[2].distance || 5000;
      runTime.value = calculation.activities[2].time || 1500;
      runPace.value = calculation.activities[2].paceOrSpeed || 300;
    }

    // Apply transition times
    t1Time.value = calculation.transitionTimes?.[1] || 300;
    t2Time.value = calculation.transitionTimes?.[2] || 300;

    // Set loaded history name
    loadedHistoryName.value = calculation.name || "Geladene Berechnung";

    // Set preset with proper timing
    await nextTick();

    if (calculation.presetType) {
      preset.value = calculation.presetType;
      setPreset(calculation.presetType);
    } else {
      preset.value = "";
    }

    // Force component re-render to update UI
    componentKey.value += 1;

    // Show success message
    saveMessage.value = "Berechnung erfolgreich geladen!";
    setTimeout(() => {
      saveMessage.value = "";
    }, 3000);

    console.log(
      "PaceRechner: Successfully loaded calculation without page reload"
    );
  } catch (error) {
    console.error("Error loading calculation:", error);
    saveMessage.value = "Fehler beim Laden der Berechnung!";
    setTimeout(() => {
      saveMessage.value = "";
    }, 3000);
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 800px) {
    display: block;
    flex-wrap: nowrap;
  }

  .pace-rechner {
    flex-grow: 1;
    border: 4px solid #333;
    border-radius: 28px;
    margin: 8px;

    ::v-deep(.wrapper) {
      display: flex;
      flex-flow: column;
      border-radius: 28px;
      min-height: 100%;
      position: relative;

      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        border-radius: 28px;
        padding: 2px 10px;
        font-size: 0.8rem;
        color: #fff;
      }

      .row {
        padding: 10px;

        .label {
          width: 80px;
          padding-right: 5px;
        }
      }
    }

    @media screen and (max-width: 800px) {
      margin: 18px 0;

      .wrapper {
        align-items: center;
      }
    }
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin: 12px 12px 24px 12px;

  select {
    font-size: 14px;
    border: 4px solid #333;
    border-radius: 28px;
    padding: 8px;
    background: var(--bg-card);
    color: var(--text-main);
  }

  ::v-deep(.vue__time-picker .vue__time-picker-input) {
    border: 1px solid #333;
    border-radius: 4px;
    color: #333;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
    align-items: center;

    .select {
      width: 100%;
    }
  }
}

.save-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
}

.save-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

@media (min-width: 640px) {
  .save-controls {
    flex-direction: row;
    align-items: center;
  }
}

.save-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-body);
  color: var(--text-main);
  font-size: 1rem;
}

.save-input:focus {
  outline: none;
  border-color: rgb(var(--accent));
  box-shadow: 0 0 0 3px rgba(var(--accent), 0.1);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  white-space: nowrap;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: rgb(var(--accent));
  color: white;
}

.btn-primary:hover {
  background: rgb(var(--accent-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--accent), 0.3);
}

.btn-disabled {
  background: var(--bg-card-hover);
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.save-message {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #10b981;
}
</style>
