<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold mb-6 text-center">Zusammenfassung</h2>

    <div class="space-y-4">
      <!-- Total Time -->
      <div
        class="flex justify-between items-center py-2 border-b border-gray-100"
      >
        <span class="font-semibold">Gesamtzeit:</span>
        <span class="font-bold text-lg">{{ totalTimeString }}</span>
      </div>

      <!-- Average Speed -->
      <div
        class="flex justify-between items-center py-2 border-b border-gray-100"
      >
        <span class="font-semibold">Ø-Geschwindigkeit:</span>
        <span>{{ averageSpeedString }}</span>
      </div>

      <!-- Start Time -->
      <div
        class="flex justify-between items-center py-2 border-b border-gray-100"
      >
        <span class="font-semibold">Startzeit:</span>
        <span>{{ startTimeString }}</span>
      </div>

      <!-- Finish Time -->
      <div
        class="flex justify-between items-center py-2 border-b border-gray-100"
      >
        <span class="font-semibold">Zielzeit:</span>
        <span class="font-bold">{{ finishTimeString }}</span>
      </div>

      <!-- Activity Breakdown -->
      <div v-if="activities.length > 1" class="mt-6">
        <h3 class="font-semibold mb-3">Einzelzeiten:</h3>
        <div class="space-y-2">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex justify-between items-center py-1 text-sm"
          >
            <span>{{ getSportTitle(activity.type, index) }}:</span>
            <span>{{ secondsToHHMMSS(activity.time, true) }}</span>
          </div>

          <!-- Transitions -->
          <template
            v-for="(time, transitionIndex) in transitionTimes"
            :key="`transition-${transitionIndex}`"
          >
            <div
              class="flex justify-between items-center py-1 text-sm text-orange-600"
            >
              <span>{{ transitionIndex === 0 ? "T1" : "T2" }}:</span>
              <span>{{ secondsToHHMMSS(time, true) }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Save Calculation -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <button
          @click="saveCalculation"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          Berechnung speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SportActivity } from "../types/PaceRechner";
import { SportsType } from "../types/PaceRechner";
import { secondsToHHMMSS } from "../utils/calculations";

// Props
interface Props {
  totalTime: number;
  averageSpeed: number;
  startTime: number;
  finishTime: number;
  activities: SportActivity[];
  transitionTimes?: Record<number, number>;
}

const props = withDefaults(defineProps<Props>(), {
  transitionTimes: () => ({}),
});

// Emits
const emit = defineEmits<{
  save: [calculation: any];
}>();

// Computed
const totalTimeString = computed(() => {
  return secondsToHHMMSS(props.totalTime, false);
});

const averageSpeedString = computed(() => {
  return `${props.averageSpeed.toFixed(1)} km/h`;
});

const startTimeString = computed(() => {
  return secondsToHHMMSS(props.startTime, true);
});

const finishTimeString = computed(() => {
  return secondsToHHMMSS(props.finishTime, true);
});

// Methods
const getSportTitle = (type: SportsType, index: number): string => {
  switch (type) {
    case SportsType.Swim:
      return "Schwimmen";
    case SportsType.Bike:
      return "Radfahren";
    case SportsType.Run:
      // Handle multiple runs in competitions
      const runCount = props.activities
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

const saveCalculation = () => {
  const calculation = {
    id: Date.now().toString(),
    name: `Berechnung ${new Date().toLocaleDateString()}`,
    timestamp: Date.now(),
    activities: props.activities,
    transitionTimes: props.transitionTimes,
    dayTimeStart: props.startTime,
    presetType: "custom",
    totalTime: props.totalTime,
  };

  emit("save", calculation);

  // Here you could also save to localStorage or send to an API
  const savedCalculations = JSON.parse(
    localStorage.getItem("pace-calculations") || "[]"
  );
  savedCalculations.push(calculation);
  localStorage.setItem("pace-calculations", JSON.stringify(savedCalculations));

  // Show success message (you might want to use a toast library)
  alert("Berechnung gespeichert!");
};
</script>
