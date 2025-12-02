import { ref, computed, watch } from "vue";
import type {
  SportActivity,
  PaceCalculation,
  CompetitionType,
} from "../types/PaceRechner";
import { SportsType } from "../types/PaceRechner";
import {
  calculateTimeFromPaceOrSpeed,
  calculatePaceOrSpeedFromTime,
  calculateDistanceFromTimeAndPace,
  getSportConfig,
} from "../utils/calculations";

export const useMultiSportCalculations = () => {
  // State
  const activities = ref<SportActivity[]>([]);
  const transitionTimes = ref<Record<number, number>>({});
  const dayTimeStart = ref(25200); // 07:00:00 in seconds
  const preset = ref("");
  const presetExpanded = ref(false);

  // Competition presets
  const getPresetActivities = (
    presetType: string
  ): { activities: SportActivity[]; transitions: Record<number, number> } => {
    switch (presetType) {
      case "sprint":
        return {
          activities: [
            {
              type: SportsType.Swim,
              distance: 750.0,
              time: 900,
              paceOrSpeed: 120.0,
            },
            {
              type: SportsType.Bike,
              distance: 20.0,
              time: 2880,
              paceOrSpeed: 25.0,
            },
            {
              type: SportsType.Run,
              distance: 5000.0,
              time: 1500,
              paceOrSpeed: 300.0,
            },
          ],
          transitions: { 0: 120, 1: 90 },
        };
      case "olympic":
        return {
          activities: [
            {
              type: SportsType.Swim,
              distance: 1500.0,
              time: 1800,
              paceOrSpeed: 120.0,
            },
            {
              type: SportsType.Bike,
              distance: 40.0,
              time: 5760,
              paceOrSpeed: 25.0,
            },
            {
              type: SportsType.Run,
              distance: 10000.0,
              time: 3000,
              paceOrSpeed: 300.0,
            },
          ],
          transitions: { 0: 120, 1: 90 },
        };
      case "md":
        return {
          activities: [
            {
              type: SportsType.Swim,
              distance: 1900.0,
              time: 2280,
              paceOrSpeed: 120.0,
            },
            {
              type: SportsType.Bike,
              distance: 90.0,
              time: 12960,
              paceOrSpeed: 25.0,
            },
            {
              type: SportsType.Run,
              distance: 21097.5,
              time: 8017,
              paceOrSpeed: 380.0,
            },
          ],
          transitions: { 0: 120, 1: 120 },
        };
      case "ld":
        return {
          activities: [
            {
              type: SportsType.Swim,
              distance: 3800.0,
              time: 5700,
              paceOrSpeed: 150.0,
            },
            {
              type: SportsType.Bike,
              distance: 180.0,
              time: 25920,
              paceOrSpeed: 25.0,
            },
            {
              type: SportsType.Run,
              distance: 42195.0,
              time: 18000,
              paceOrSpeed: 430.0,
            },
          ],
          transitions: { 0: 240, 1: 240 },
        };
      case "duathlon":
        return {
          activities: [
            {
              type: SportsType.Run,
              distance: 10000.0,
              time: 3000,
              paceOrSpeed: 300.0,
            },
            {
              type: SportsType.Bike,
              distance: 40.0,
              time: 5760,
              paceOrSpeed: 25.0,
            },
            {
              type: SportsType.Run,
              distance: 5000.0,
              time: 1500,
              paceOrSpeed: 300.0,
            },
          ],
          transitions: { 0: 90, 1: 90 },
        };
      default:
        return {
          activities: [
            {
              type: SportsType.Run,
              distance: 5000.0,
              time: 1500,
              paceOrSpeed: 300.0,
            },
          ],
          transitions: {},
        };
    }
  };

  // Computed values
  const totalTime = computed(() => {
    const activityTime = activities.value.reduce(
      (sum, activity) => sum + activity.time,
      0
    );
    const transitionTime = Object.values(transitionTimes.value).reduce(
      (sum, time) => sum + time,
      0
    );
    return activityTime + transitionTime;
  });

  const totalDistance = computed(() => {
    return activities.value.reduce((sum, activity) => {
      // Convert all distances to km for consistency
      switch (activity.type) {
        case SportsType.Swim:
        case SportsType.Run:
        case SportsType.Hiking:
        case SportsType.Walking:
          return sum + activity.distance / 1000;
        case SportsType.Bike:
        case SportsType.Rowing:
          return sum + activity.distance;
        default:
          return sum;
      }
    }, 0);
  });

  const averageSpeed = computed(() => {
    if (totalTime.value === 0) return 0;
    return totalDistance.value / (totalTime.value / 3600);
  });

  const finishTime = computed(() => {
    return dayTimeStart.value + totalTime.value;
  });

  // Methods
  const loadPreset = (presetType: string) => {
    const { activities: presetActivities, transitions } =
      getPresetActivities(presetType);
    activities.value = [...presetActivities];
    transitionTimes.value = { ...transitions };
    preset.value = presetType;
  };

  const updateActivityDistance = (index: number, distance: number) => {
    if (activities.value[index]) {
      activities.value[index].distance = distance;
      // Recalculate time based on pace/speed
      activities.value[index].time = calculateTimeFromPaceOrSpeed(
        activities.value[index]
      );
    }
  };

  const updateActivityTime = (index: number, time: number) => {
    if (activities.value[index]) {
      activities.value[index].time = time;
      // Recalculate pace/speed based on time and distance
      activities.value[index].paceOrSpeed = calculatePaceOrSpeedFromTime(
        activities.value[index]
      );
    }
  };

  const updateActivityPaceOrSpeed = (index: number, paceOrSpeed: number) => {
    if (activities.value[index]) {
      activities.value[index].paceOrSpeed = paceOrSpeed;
      // Recalculate time based on distance and pace/speed
      activities.value[index].time = calculateTimeFromPaceOrSpeed(
        activities.value[index]
      );
    }
  };

  const updateTransitionTime = (transitionIndex: number, time: number) => {
    transitionTimes.value[transitionIndex] = time;
  };

  const addActivity = (type: SportsType) => {
    const config = getSportConfig(type);
    const newActivity: SportActivity = {
      type,
      distance: config.defaultDistance,
      time: 1800, // 30 minutes default
      paceOrSpeed: config.defaultPaceSpeed,
    };
    activities.value.push(newActivity);
  };

  const removeActivity = (index: number) => {
    activities.value.splice(index, 1);
    // Clean up transition times
    const newTransitions: Record<number, number> = {};
    Object.keys(transitionTimes.value).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey < index) {
        newTransitions[numKey] = transitionTimes.value[numKey];
      } else if (numKey > index) {
        newTransitions[numKey - 1] = transitionTimes.value[numKey];
      }
    });
    transitionTimes.value = newTransitions;
  };

  const getCumulativeTime = (upToIndex: number): number => {
    let cumulative = 0;
    for (
      let i = 0;
      i <= Math.min(upToIndex, activities.value.length - 1);
      i++
    ) {
      cumulative += activities.value[i].time;
    }
    return cumulative;
  };

  const getClockTime = (upToIndex: number): number => {
    const cumulativeTime = getCumulativeTime(upToIndex);
    const transitionTimeSum = Object.keys(transitionTimes.value)
      .map((key) => parseInt(key))
      .filter((key) => key < upToIndex)
      .reduce((sum, key) => sum + transitionTimes.value[key], 0);

    return dayTimeStart.value + cumulativeTime + transitionTimeSum;
  };

  // Initialize with default activity
  if (activities.value.length === 0) {
    addActivity(SportsType.Run);
  }

  return {
    // State
    activities,
    transitionTimes,
    dayTimeStart,
    preset,
    presetExpanded,

    // Computed
    totalTime,
    totalDistance,
    averageSpeed,
    finishTime,

    // Methods
    loadPreset,
    updateActivityDistance,
    updateActivityTime,
    updateActivityPaceOrSpeed,
    updateTransitionTime,
    addActivity,
    removeActivity,
    getCumulativeTime,
    getClockTime,
    getPresetActivities,
  };
};
