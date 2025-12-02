import { computed, ref, type Ref } from "vue";
import { secondsToHHMMSS } from "../utils/calculations";
import { usePresets } from "./usePresets";

export function usePaceCalculations() {
  // Initialize presets composable
  const { applyTriathlonPreset } = usePresets();

  // Base reactive data
  const dayTimeStart = ref(25200);
  const dayTimeFinish = ref("");

  const swimDistance = ref(3800);
  const swimTime = ref(0);
  const swimPace = ref(120);

  const bikeDistance = ref(180);
  const bikeTime = ref(0);
  const bikeSpeed = ref(25);

  const runDistance = ref(42195);
  const runTime = ref(0);
  const runPace = ref(380);

  // New sports
  const rowDistance = ref(2000);
  const rowTime = ref(0);
  const rowSpeed = ref(12);

  const hikeDistance = ref(10000);
  const hikeTime = ref(0);
  const hikePace = ref(480);

  const walkDistance = ref(5000);
  const walkTime = ref(0);
  const walkPace = ref(420);

  const t1Time = ref(300);
  const t2Time = ref(300);

  // Total time calculations
  const totalTime = computed(() => {
    if (swimTime.value && bikeTime.value && runTime.value) {
      return (
        swimTime.value +
        bikeTime.value +
        runTime.value +
        t1Time.value +
        t2Time.value
      );
    }
    return 0;
  });

  const totalTimeAfterSwim = computed(() => {
    if (swimTime.value) {
      return swimTime.value;
    }
    return 0;
  });

  const totalTimeAfterBike = computed(() => {
    if (swimTime.value && bikeTime.value) {
      return swimTime.value + bikeTime.value + t1Time.value;
    }
    return 0;
  });

  // Individual time strings
  const swimTimeString = computed(() => {
    return secondsToHHMMSS(swimTime.value, false);
  });

  const bikeTimeString = computed(() => {
    return secondsToHHMMSS(bikeTime.value, false);
  });

  const runTimeString = computed(() => {
    return secondsToHHMMSS(runTime.value, false);
  });

  const rowTimeString = computed(() => {
    return secondsToHHMMSS(rowTime.value, false);
  });

  const hikeTimeString = computed(() => {
    return secondsToHHMMSS(hikeTime.value, false);
  });

  const walkTimeString = computed(() => {
    return secondsToHHMMSS(walkTime.value, false);
  });

  const t1TimeString = computed(() => {
    return secondsToHHMMSS(t1Time.value, false);
  });

  const t2TimeString = computed(() => {
    return secondsToHHMMSS(t2Time.value, false);
  });

  const totalTimeString = computed(() => {
    dayTimeFinish.value = secondsToHHMMSS(
      dayTimeStart.value + totalTime.value,
      false
    );
    return secondsToHHMMSS(totalTime.value, false);
  });

  // Cumulative time strings
  const swimCumulativeTimeString = computed(() => {
    return secondsToHHMMSS(swimTime.value, false);
  });

  const t1CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(swimTime.value + t1Time.value, false);
  });

  const bikeCumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value + t1Time.value + bikeTime.value,
      false
    );
  });

  const t2CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value + t1Time.value + bikeTime.value + t2Time.value,
      false
    );
  });

  // Clock time strings
  const dayTimeStartString = computed(() => {
    return secondsToHHMMSS(dayTimeStart.value, false);
  });

  const totalTimeAfterSwimString = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value + totalTimeAfterSwim.value,
      false
    );
  });

  const timeAfterT1String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value + swimTime.value + t1Time.value,
      false
    );
  });

  const totalTimeAfterBikeString = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value + totalTimeAfterBike.value,
      false
    );
  });

  const timeAfterT2String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value,
      false
    );
  });

  // Kilometer calculations for splits
  const bikeQuarter1Km = computed(() => {
    return Math.round(bikeDistance.value * 0.25 * 10) / 10;
  });

  const bikeHalfKm = computed(() => {
    return Math.round(bikeDistance.value * 0.5 * 10) / 10;
  });

  const bikeThreeQuarterKm = computed(() => {
    return Math.round(bikeDistance.value * 0.75 * 10) / 10;
  });

  const runQuarter1Km = computed(() => {
    return Math.round((runDistance.value / 1000) * 0.25 * 10) / 10;
  });

  const runHalfKm = computed(() => {
    return Math.round((runDistance.value / 1000) * 0.5 * 10) / 10;
  });

  const runThreeQuarterKm = computed(() => {
    return Math.round((runDistance.value / 1000) * 0.75 * 10) / 10;
  });

  // Bike splits (25%, 50%, 75%)
  const bike25TimeString = computed(() => {
    return secondsToHHMMSS(bikeTime.value * 0.25, false);
  });

  const bike50TimeString = computed(() => {
    return secondsToHHMMSS(bikeTime.value * 0.5, false);
  });

  const bike75TimeString = computed(() => {
    return secondsToHHMMSS(bikeTime.value * 0.75, false);
  });

  // Run splits (25%, 50%, 75%)
  const run25TimeString = computed(() => {
    return secondsToHHMMSS(runTime.value * 0.25, false);
  });

  const run50TimeString = computed(() => {
    return secondsToHHMMSS(runTime.value * 0.5, false);
  });

  const run75TimeString = computed(() => {
    return secondsToHHMMSS(runTime.value * 0.75, false);
  });

  // Bike cumulative splits
  const bike25CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value + t1Time.value + bikeTime.value * 0.25,
      false
    );
  });

  const bike50CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value + t1Time.value + bikeTime.value * 0.5,
      false
    );
  });

  const bike75CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value + t1Time.value + bikeTime.value * 0.75,
      false
    );
  });

  // Run cumulative splits
  const run25CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.25,
      false
    );
  });

  const run50CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.5,
      false
    );
  });

  const run75CumulativeTimeString = computed(() => {
    return secondsToHHMMSS(
      swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.75,
      false
    );
  });

  // Clock time splits for bike
  const clockTimeBike25String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value * 0.25,
      false
    );
  });

  const clockTimeBike50String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value + swimTime.value + t1Time.value + bikeTime.value * 0.5,
      false
    );
  });

  const clockTimeBike75String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value * 0.75,
      false
    );
  });

  // Clock time splits for run
  const clockTimeRun25String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.25,
      false
    );
  });

  const clockTimeRun50String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.5,
      false
    );
  });

  const clockTimeRun75String = computed(() => {
    return secondsToHHMMSS(
      dayTimeStart.value +
        swimTime.value +
        t1Time.value +
        bikeTime.value +
        t2Time.value +
        runTime.value * 0.75,
      false
    );
  });

  // Handler for day time start change
  const onChangeDayTimeStart = (value: number) => {
    dayTimeFinish.value = secondsToHHMMSS(
      dayTimeStart.value + totalTime.value,
      false
    );
  };

  // Preset function
  const setPreset = (preset: string) => {
    applyTriathlonPreset(preset, {
      swimDistance,
      swimPace,
      swimTime,
      bikeDistance,
      bikeSpeed,
      bikeTime,
      runDistance,
      runPace,
      runTime,
      t1Time,
      t2Time,
    });
  };

  return {
    // Base data
    dayTimeStart,
    dayTimeFinish,
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

    // Individual time strings
    swimTimeString,
    bikeTimeString,
    runTimeString,
    rowTimeString,
    hikeTimeString,
    walkTimeString,
    t1TimeString,
    t2TimeString,
    totalTimeString,

    // Cumulative time strings
    swimCumulativeTimeString,
    t1CumulativeTimeString,
    bikeCumulativeTimeString,
    t2CumulativeTimeString,

    // Clock time strings
    dayTimeStartString,
    totalTimeAfterSwimString,
    timeAfterT1String,
    totalTimeAfterBikeString,
    timeAfterT2String,

    // Kilometer values for splits
    bikeQuarter1Km,
    bikeHalfKm,
    bikeThreeQuarterKm,
    runQuarter1Km,
    runHalfKm,
    runThreeQuarterKm,

    // Bike splits
    bike25TimeString,
    bike50TimeString,
    bike75TimeString,

    // Run splits
    run25TimeString,
    run50TimeString,
    run75TimeString,

    // Bike cumulative splits
    bike25CumulativeTimeString,
    bike50CumulativeTimeString,
    bike75CumulativeTimeString,

    // Run cumulative splits
    run25CumulativeTimeString,
    run50CumulativeTimeString,
    run75CumulativeTimeString,

    // Clock time splits
    clockTimeBike25String,
    clockTimeBike50String,
    clockTimeBike75String,
    clockTimeRun25String,
    clockTimeRun50String,
    clockTimeRun75String,

    // Base computed values
    totalTime,

    // Functions
    onChangeDayTimeStart,
    setPreset,
  };
}
