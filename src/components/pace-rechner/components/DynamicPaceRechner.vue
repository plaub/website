<template>
  <div class="space-y-6 p-4 pb-8">
    <!-- Preset Selection -->
    <div
      v-if="availablePresets.length > 0"
      class="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 class="text-lg font-semibold mb-4">Templates</h3>
      <div class="relative">
        <select
          v-model="selectedPreset"
          @change="onPresetChange"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Templates wählen</option>
          <option
            v-for="preset in availablePresets"
            :key="preset.value"
            :value="preset.value"
          >
            {{ preset.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Activities -->
    <div
      v-for="(activity, index) in calculations.activities.value"
      :key="index"
      class="space-y-4"
    >
      <!-- Sport Activity -->
      <PaceRechnerForm
        :title="getSportTitle(activity.type, index)"
        :background-color="getSportColor(activity.type).background"
        :color="getSportColor(activity.type).text"
        :distance="activity.distance"
        :time="activity.time"
        :pace="
          getSportConfig(activity.type).isPace
            ? Math.round(activity.paceOrSpeed)
            : 0
        "
        :speed="
          !getSportConfig(activity.type).isPace ? activity.paceOrSpeed : 0
        "
        :pace-type="
          getSportConfig(activity.type).isPace ? PaceType.Pace : PaceType.Speed
        "
        :pace-unit="getSportPaceUnit(activity.type)"
        :distance-unit="getSportDistanceUnit(activity.type)"
        @update:distance="(val: number) => calculations.updateActivityDistance(index, val)"
        @update:time="(val: number) => calculations.updateActivityTime(index, val)"
        @update:pace="(val: number) => calculations.updateActivityPaceOrSpeed(index, val)"
        @update:speed="(val: number) => calculations.updateActivityPaceOrSpeed(index, val)"
      />

      <!-- Transition (if not last activity and has transitions) -->
      <div
        v-if="
          index < calculations.activities.value.length - 1 && hasTransitions
        "
        class="bg-orange-500 rounded-2xl shadow-lg p-6 text-white"
      >
        <h3 class="text-lg font-semibold mb-4">
          {{ getTransitionTitle(index) }}
        </h3>
        <DurationPicker
          :total-seconds="calculations.transitionTimes.value[index] || 90"
          @update:total-seconds="(val: number) => calculations.updateTransitionTime(index, val)"
          backgroundColor="#6b7280"
        />
      </div>
    </div>

    <!-- Add Activity Button -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="sportType in availableSports"
          :key="sportType"
          @click="calculations.addActivity(sportType)"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + {{ sportType }}
        </button>
      </div>
    </div>

    <!-- Summary -->
    <MultiSportSummary
      :total-time="calculations.totalTime.value"
      :average-speed="calculations.averageSpeed.value"
      :start-time="calculations.dayTimeStart.value"
      :finish-time="calculations.finishTime.value"
      :activities="calculations.activities.value"
      :transition-times="calculations.transitionTimes.value"
      @save="onSaveCalculation"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import DurationPicker from "./DurationPicker.vue";
import PaceRechnerForm from "./PaceRechnerForm.vue";
import MultiSportSummary from "./MultiSportSummary.vue";
import type { PaceCalculation } from "../types/PaceRechner";
import {
  SportsType,
  PaceType,
  getPaceUnitFromString,
  getDistanceUnitFromString,
} from "../types/PaceRechner";
import { useMultiSportCalculations } from "../composables/useMultiSportCalculations";
import { getSportConfig } from "../utils/calculations";

// Props
interface Props {
  competitionType?: string;
  loadedCalculation?: PaceCalculation | null;
}

const props = withDefaults(defineProps<Props>(), {
  competitionType: "individual",
  loadedCalculation: null,
});

// Composables
const calculations = useMultiSportCalculations();

// State
const selectedPreset = ref("");

// Computed
const availablePresets = computed(() => {
  const presets = [
    { value: "sprint", label: "Sprint Triathlon" },
    { value: "olympic", label: "Olympic Triathlon" },
    { value: "md", label: "Mitteldistanz" },
    { value: "ld", label: "Langdistanz" },
    { value: "duathlon", label: "Duathlon" },
  ];

  return presets;
});

const availableSports = computed(() => {
  return Object.values(SportsType);
});

const hasTransitions = computed(() => {
  return (
    calculations.activities.value.length > 1 &&
    ["sprint", "olympic", "md", "ld", "duathlon"].includes(
      props.competitionType
    )
  );
});

// Methods
const onPresetChange = () => {
  if (selectedPreset.value) {
    calculations.loadPreset(selectedPreset.value);
  }
};

const getSportTitle = (type: SportsType, index: number): string => {
  switch (type) {
    case SportsType.Swim:
      return "Schwimmen";
    case SportsType.Bike:
      return "Radfahren";
    case SportsType.Run:
      // Handle multiple runs in competitions
      const runCount = calculations.activities.value
        .slice(0, index + 1)
        .filter((a) => a.type === SportsType.Run).length;
      return runCount > 1 ? `Laufen ${runCount}` : "Laufen";
    case SportsType.Rowing:
      return "Rudern";
    case SportsType.Hiking:
      return "Wandern";
    case SportsType.Walking:
      return "Gehen";
    default:
      return type;
  }
};

const getSportColor = (type: SportsType) => {
  switch (type) {
    case SportsType.Swim:
      return { background: "#3B82F6", text: "white" }; // Blue
    case SportsType.Bike:
      return { background: "#EF4444", text: "white" }; // Red
    case SportsType.Run:
      return { background: "#10B981", text: "white" }; // Green
    case SportsType.Rowing:
      return { background: "#8B5CF6", text: "white" }; // Purple
    case SportsType.Hiking:
      return { background: "#F59E0B", text: "white" }; // Amber
    case SportsType.Walking:
      return { background: "#6B7280", text: "white" }; // Gray
    default:
      return { background: "#374151", text: "white" }; // Gray-700
  }
};

const getSportPaceUnit = (type: SportsType) => {
  const config = getSportConfig(type);
  return getPaceUnitFromString(config.paceSpeedUnit);
};

const getSportDistanceUnit = (type: SportsType) => {
  return getDistanceUnitFromString(getSportConfig(type).distanceUnit);
};

const getTransitionTitle = (index: number): string => {
  return index === 0 ? "T1" : "T2";
};

const onSaveCalculation = (calculation: any) => {
  console.log("Calculation saved:", calculation);
};

// Watch for loaded calculations
watch(
  () => props.loadedCalculation,
  (newCalculation) => {
    if (newCalculation) {
      console.log("Loading calculation:", newCalculation);
      // Load the calculation data into the form
      calculations.activities.value = [...newCalculation.activities];
      calculations.transitionTimes.value = {
        ...newCalculation.transitionTimes,
      };
      calculations.dayTimeStart.value = newCalculation.dayTimeStart;
      calculations.preset.value = newCalculation.presetType;
    }
  },
  { immediate: true }
);
</script>
